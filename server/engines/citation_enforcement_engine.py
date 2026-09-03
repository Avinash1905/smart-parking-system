"""
SmartPark Automated Citation & Enforcement Engine
Evaluates overstay timers, parking boundary infringements, permit forgery,
and calculates tiered fine schedules with escalation grace periods.
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import uuid

class CitationEnforcementEngine:
    VIOLATION_TYPES = {
        "OVERSTAY_GRACE_EXCEEDED": {
            "title": "Expired Parking Duration",
            "base_fine": 500.0,
            "escalation_interval_mins": 60,
            "escalation_amount": 250.0,
            "requires_boot": False
        },
        "UNAUTHORIZED_PRIVATE_BAY": {
            "title": "Unauthorized Corporate Bay Intrusion",
            "base_fine": 1200.0,
            "escalation_interval_mins": 30,
            "escalation_amount": 500.0,
            "requires_boot": True
        },
        "NON_EV_BLOCKING_CHARGER": {
            "title": "ICE Vehicle Blocking EV Charging Station",
            "base_fine": 1500.0,
            "escalation_interval_mins": 30,
            "escalation_amount": 500.0,
            "requires_boot": True
        },
        "ADA_BAY_UNAUTHORIZED": {
            "title": "Unauthorized Parking in Handicap ADA Spot",
            "base_fine": 2500.0,
            "escalation_interval_mins": 15,
            "escalation_amount": 1000.0,
            "requires_boot": True
        },
        "DOUBLE_PARKING_OBSTRUCTION": {
            "title": "Obstruction of Emergency Fire Lane",
            "base_fine": 3000.0,
            "escalation_interval_mins": 15,
            "escalation_amount": 1000.0,
            "requires_boot": True
        }
    }

    @classmethod
    def issue_citation(
        cls,
        violation_type: str,
        vehicle_plate: str,
        zone_id: str,
        slot_number: str,
        evidence_photo_url: Optional[str] = None,
        issuer_agent_id: str = "AUTO_ANPR_SYSTEM"
    ) -> Dict[str, Any]:
        """Creates a verified infraction ticket with statutory fine schedule."""
        config = cls.VIOLATION_TYPES.get(violation_type, {
            "title": "General Parking Violation",
            "base_fine": 500.0,
            "escalation_interval_mins": 60,
            "escalation_amount": 200.0,
            "requires_boot": False
        })

        now = datetime.now()
        citation_id = f"CIT-{uuid.uuid4().hex[:8].upper()}"
        payment_due_date = (now + timedelta(days=7)).strftime("%Y-%m-%d")

        return {
            "citation_id": citation_id,
            "violation_type": violation_type,
            "violation_title": config["title"],
            "vehicle_plate": vehicle_plate.upper(),
            "zone_id": zone_id,
            "slot_number": slot_number,
            "issued_at": now.isoformat(),
            "issuer": issuer_agent_id,
            "base_fine_amount": config["base_fine"],
            "escalation_amount_per_interval": config["escalation_amount"],
            "escalation_interval_minutes": config["escalation_interval_mins"],
            "wheel_boot_warranted": config["requires_boot"],
            "evidence_photo": evidence_photo_url or f"https://smartpark.internal/evidence/{citation_id}.jpg",
            "payment_due_date": payment_due_date,
            "status": "UNPAID",
            "dispute_eligible": True,
            "currency": "INR"
        }
