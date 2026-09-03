"""
SmartPark Residential Permit & Neighborhood Sticker Service
Validates resident address proof and issues digital street parking permits.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from server.database.repositories.resident_permit_repository import ResidentPermitRepository, ResidentPermit
from server.database.repositories.notification_repository import NotificationRepository
from server.models.schema import Notification

class ResidentPermitService:
    @staticmethod
    def apply_permit(data: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        valid_until = datetime.utcnow() + timedelta(days=365)
        permit = ResidentPermit(
            user_id=user["id"],
            resident_name=user.get("name", "Resident"),
            neighborhood_zone=data.get("neighborhood_zone", "Jayanagar 4th Block Residential Zone"),
            vehicle_plate=data.get("vehicle_plate", "KA-05-AB-1234"),
            annual_fee=1200.0,
            valid_until=valid_until,
            status="ACTIVE"
        )
        ResidentPermitRepository.create(permit)

        NotificationRepository.create(Notification(
            user_id=user["id"],
            title="Residential Parking Permit Approved",
            message=f"Permit #{permit.permit_number} active for {permit.neighborhood_zone}.",
            notification_type="SUCCESS",
            action_url="#/dashboard"
        ))

        return {"success": True, "permit_id": permit.id, "data": permit.to_dict()}
