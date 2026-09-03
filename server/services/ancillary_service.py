"""
SmartPark Ancillary Services & Vehicle Care Service Layer
Coordinates on-site vehicle washing, vacuuming, and mechanical checks while vehicles are parked.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.ancillary_service_repository import AncillaryServiceRepository, AncillaryServiceBooking
from server.database.repositories.notification_repository import NotificationRepository
from server.models.schema import Notification

class AncillaryService:
    @staticmethod
    def book_service(data: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        stype = data.get("service_type", "ECO_WATERLESS_WASH")
        sname = "Eco Waterless Hand Car Wash" if stype == "ECO_WATERLESS_WASH" else "Interior Vacuum & Sanitization"
        price = 199.0 if stype == "ECO_WATERLESS_WASH" else 149.0

        booking = AncillaryServiceBooking(
            reservation_id=data.get("reservation_id", "RES-A2401"),
            user_id=user["id"],
            service_type=stype,
            service_name=sname,
            price=price,
            status="CONFIRMED"
        )
        AncillaryServiceRepository.create(booking)

        NotificationRepository.create(Notification(
            user_id=user["id"],
            title="Vehicle Care Service Confirmed",
            message=f"{sname} scheduled during your parking session.",
            notification_type="SUCCESS",
            action_url="#/dashboard"
        ))

        return {"success": True, "booking_id": booking.id, "data": booking.to_dict()}
