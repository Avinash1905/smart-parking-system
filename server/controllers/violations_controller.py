"""
SmartPark Violations & Enforcement Controller
Handles infraction recording, status transitions (OPEN -> UNDER_REVIEW -> RESOLVED), and evidence.
"""

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from server.database.repositories.violation_repository import ViolationRepository
from server.database.repositories.audit_log_repository import AuditLogRepository
from server.middleware.error_handler import NotFoundException
from server.models.schema import ParkingViolation, AuditLog

class ViolationsController:
    @staticmethod
    def list_violations(status: Optional[str] = None) -> Dict[str, Any]:
        viols = ViolationRepository.list_all(status=status)
        return {"success": True, "count": len(viols), "data": [v.to_dict() for v in viols]}

    @staticmethod
    def create_violation(data: Dict[str, Any], admin_id: str = "adm-001", client_ip: str = "127.0.0.1") -> Dict[str, Any]:
        v_id = f"V-{uuid.uuid4().hex[:6].upper()}"
        plate = data.get("vehicle_plate", "KA-01-XX-0000").upper().strip()

        new_v = ParkingViolation(
            id=v_id,
            vehicle_plate=plate,
            user_name=data.get("user_name", "Unregistered Driver"),
            user_email=data.get("user_email"),
            parking_zone_id=data.get("parking_zone_id", "zone-pub-01"),
            parking_zone_name=data.get("parking_zone_name", "Municipal Central Parking"),
            slot_number=data.get("slot_number", "A-01"),
            violation_type=data.get("violation_type", "Unauthorized Parking"),
            severity=data.get("severity", "MEDIUM"),
            fine_amount=float(data.get("fine_amount", 500.0)),
            date_time=datetime.utcnow(),
            status="OPEN",
            description=data.get("description", "Infraction logged."),
            evidence_notes=data.get("evidence_notes", "Barrier camera snapshot.")
        )

        ViolationRepository.create(new_v)

        AuditLogRepository.create(AuditLog(
            user_id=admin_id,
            user_email="admin@smartpark.com",
            action="VIOLATION_LOGGED",
            resource_type="ParkingViolation",
            resource_id=v_id,
            details={"plate": plate, "type": new_v.violation_type},
            ip_address=client_ip
        ))

        return {"success": True, "violation_id": v_id, "data": new_v.to_dict()}

    @staticmethod
    def update_status(violation_id: str, new_status: str, admin_id: str = "adm-001", client_ip: str = "127.0.0.1") -> Dict[str, Any]:
        v = ViolationRepository.get_by_id(violation_id)
        if not v:
            raise NotFoundException("ParkingViolation", violation_id)

        ViolationRepository.update_status(violation_id, new_status, admin_id)

        AuditLogRepository.create(AuditLog(
            user_id=admin_id,
            user_email="admin@smartpark.com",
            action="VIOLATION_STATUS_CHANGED",
            resource_type="ParkingViolation",
            resource_id=violation_id,
            details={"new_status": new_status},
            ip_address=client_ip
        ))

        return {"success": True, "violation_id": violation_id, "new_status": new_status}
