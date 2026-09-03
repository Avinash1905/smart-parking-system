"""
SmartPark Monthly Season Pass & Subscription Service
Handles subscription sign-ups, recurring renewals, and multi-vehicle plate transfers.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from server.database.repositories.season_pass_repository import SeasonPassRepository, SeasonPass
from server.database.repositories.notification_repository import NotificationRepository
from server.models.schema import Notification

class SeasonPassService:
    @staticmethod
    def buy_pass(data: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        valid_until = datetime.utcnow() + timedelta(days=30)
        p = SeasonPass(
            user_id=user["id"],
            pass_name=data.get("pass_name", "CBD Unlimited Monthly All-Access Pass"),
            pass_tier=data.get("pass_tier", "ALL_MUNICIPAL_DECKS"),
            zone_id=data.get("zone_id", "zone-pub-01"),
            monthly_fee=float(data.get("monthly_fee", 2499.0)),
            valid_until=valid_until,
            linked_vehicle_plates=data.get("linked_vehicle_plates", ["KA-01-MJ-5890"]),
            status="ACTIVE"
        )
        SeasonPassRepository.create(p)

        NotificationRepository.create(Notification(
            user_id=user["id"],
            title="Monthly Season Pass Active",
            message=f"{p.pass_name} activated! Unlimited access across all municipal decks.",
            notification_type="SUCCESS",
            action_url="#/dashboard"
        ))

        return {"success": True, "pass_id": p.id, "data": p.to_dict()}
