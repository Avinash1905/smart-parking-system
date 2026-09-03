"""
SmartPark Citation Dispute & Municipal Fine Adjudication Service
Manages dispute workflows, automatic penalty stay orders, and waiver adjudications.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.citation_repository import CitationRepository, CitationAppeal
from server.database.repositories.violation_repository import ViolationRepository
from server.database.repositories.notification_repository import NotificationRepository
from server.models.schema import Notification

class CitationService:
    @staticmethod
    def submit_appeal(data: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        appeal = CitationAppeal(
            violation_id=data.get("violation_id", "V-1024"),
            user_id=user["id"],
            driver_name=user.get("name", "Driver"),
            vehicle_plate=data.get("vehicle_plate", "KA-01-MJ-5890"),
            dispute_reason=data.get("dispute_reason", "GATE_TAG_MALFUNCTION"),
            explanation=data["explanation"],
            status="SUBMITTED"
        )
        CitationRepository.create(appeal)

        # Update Violation status to UNDER_REVIEW
        ViolationRepository.update_status(appeal.violation_id, "UNDER_REVIEW", "system", notes="Dispute appeal filed by driver.")

        NotificationRepository.create(Notification(
            user_id=user["id"],
            title="Citation Dispute Submitted",
            message=f"Appeal #{appeal.id} for Notice {appeal.violation_id} registered. Late fees stayed during adjudication.",
            notification_type="INFO",
            action_url="#/dashboard"
        ))

        return {"success": True, "appeal_id": appeal.id, "data": appeal.to_dict()}
