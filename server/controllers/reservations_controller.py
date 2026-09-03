"""
SmartPark Reservations & Booking Controller
Handles booking creation, payment calculations, QR pass issuance, and check-in / check-out.
"""

import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from server.database.repositories.reservation_repository import ReservationRepository
from server.database.repositories.parking_zone_repository import ParkingZoneRepository
from server.database.repositories.parking_slot_repository import ParkingSlotRepository
from server.database.repositories.notification_repository import NotificationRepository
from server.database.repositories.audit_log_repository import AuditLogRepository
from server.engines.pricing_tariff_engine import PricingTariffEngine
from server.middleware.auth_middleware import AuthMiddleware
from server.middleware.request_validator import RequestValidator
from server.middleware.error_handler import NotFoundException, ForbiddenException, ConflictException
from server.models.schema import Reservation, Notification, AuditLog

class ReservationsController:
    @staticmethod
    def create_reservation(data: Dict[str, Any], user: Dict[str, Any], client_ip: str = "127.0.0.1") -> Dict[str, Any]:
        RequestValidator.validate_reservation(data)
        zone_id = data["parking_zone_id"]

        zone = ParkingZoneRepository.get_by_id(zone_id)
        if not zone:
            raise NotFoundException("ParkingZone", zone_id)

        # Enforce corporate access authorization
        if not AuthMiddleware.can_access_zone(user, zone.category, zone.company_id, zone_id):
            raise ForbiddenException(f"You do not have corporate authorization to reserve parking at {zone.name}.")

        # Find available slot
        slot = ParkingSlotRepository.find_available_slot(zone_id, require_ev=data.get("require_ev", False))
        slot_id = slot.id if slot else None
        slot_number = slot.slot_number if slot else "A-01"

        duration = float(data.get("duration_hours", 2.0))
        now = datetime.utcnow()
        end_time = now + timedelta(hours=duration)

        # Dynamic tariff calculation
        occ_pct = ((zone.total_spaces - zone.available_spaces) / max(zone.total_spaces, 1)) * 100.0
        fare_info = PricingTariffEngine.calculate_fare(
            base_rate_per_hour=zone.price_per_hour,
            duration_hours=duration,
            occupancy_percent=occ_pct,
            is_ev=data.get("require_ev", False),
            is_corporate_partner=bool(user.get("company_id"))
        )

        res_id = f"RES-{uuid.uuid4().hex[:6].upper()}"
        pass_code = f"SPK-{uuid.uuid4().hex[:8].upper()}"

        new_res = Reservation(
            id=res_id,
            user_id=user["id"],
            user_name=user.get("name", "Driver"),
            user_email=user.get("email"),
            parking_zone_id=zone_id,
            parking_zone_name=zone.name,
            slot_id=slot_id,
            slot_number=slot_number,
            vehicle_plate=data.get("vehicle_plate", "KA-01-MJ-5890"),
            vehicle_type=data.get("vehicle_type", "Car"),
            start_time=now,
            end_time=end_time,
            duration_hours=duration,
            hourly_rate=zone.price_per_hour,
            total_amount=fare_info["total_billed_inr"],
            payment_status="PAID",
            status="RESERVED",
            qr_pass_token=pass_code
        )

        ReservationRepository.create(new_res)

        # Lock slot
        if slot_id:
            ParkingSlotRepository.set_slot_status(slot_id, "RESERVED", vehicle_plate=new_res.vehicle_plate, reservation_id=res_id)

        # Decrement space
        ParkingZoneRepository.update_spaces(zone_id, available_delta=-1)

        # Notification
        NotificationRepository.create(Notification(
            user_id=user["id"],
            title="Reservation Confirmed",
            message=f"Bay {slot_number} reserved at {zone.name} for {duration}h. Total: ₹{fare_info['total_billed_inr']}",
            notification_type="SUCCESS",
            action_url="#/dashboard"
        ))

        # Audit
        AuditLogRepository.create(AuditLog(
            user_id=user["id"],
            user_email=user.get("email"),
            action="RESERVATION_CREATED",
            resource_type="Reservation",
            resource_id=res_id,
            details={"zone": zone.name, "slot": slot_number, "total": fare_info["total_billed_inr"]},
            ip_address=client_ip
        ))

        return {
            "success": True,
            "reservation_id": res_id,
            "pass_code": pass_code,
            "slot_number": slot_number,
            "valid_until": end_time.isoformat(),
            "fare_breakdown": fare_info
        }

    @staticmethod
    def get_my_reservations(user_id: str) -> Dict[str, Any]:
        res_list = ReservationRepository.list_by_user(user_id)
        return {"success": True, "count": len(res_list), "data": [r.to_dict() for r in res_list]}
