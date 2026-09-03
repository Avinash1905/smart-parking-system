"""
SmartPark Automated Valet & Conveyor Retrieval Service
Manages digital drop-off, key locker security pins, and conveyor retrieval time estimates.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import random
from server.database.repositories.valet_repository import ValetRepository, ValetTicket
from server.database.repositories.notification_repository import NotificationRepository
from server.models.schema import Notification

class ValetService:
    @staticmethod
    def issue_valet_ticket(data: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        stall = f"ROBOTIC-BAY-{random.randint(10, 80)}"
        pin = f"{random.randint(1000, 9999)}"

        ticket = ValetTicket(
            user_id=user["id"],
            user_name=user.get("name", "Driver"),
            vehicle_plate=data.get("vehicle_plate", "KA-01-MJ-5890"),
            zone_id=data.get("zone_id", "zone-pub-01"),
            zone_name=data.get("zone_name", "Municipal Central Parking"),
            robotic_stall_id=stall,
            key_locker_code=pin,
            status="PARKED"
        )
        ValetRepository.create(ticket)

        NotificationRepository.create(Notification(
            user_id=user["id"],
            title="Digital Valet Ticket Issued",
            message=f"Vehicle securely stowed in {stall}. Key drop PIN: {pin}.",
            notification_type="SUCCESS",
            action_url="#/dashboard"
        ))

        return {"success": True, "valet_ticket_id": ticket.id, "data": ticket.to_dict()}

    @staticmethod
    def request_vehicle_retrieval(ticket_code: str) -> Dict[str, Any]:
        return {
            "success": True,
            "ticket_code": ticket_code,
            "estimated_ready_seconds": 180,
            "pickup_bay": "VALET-DECK-NORTH-01",
            "status": "RETRIEVAL_REQUESTED"
        }
