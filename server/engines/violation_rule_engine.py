"""
SmartPark Violation Detection & Rules Evaluation Engine
Evaluates telemetry events against finite-state rules to automatically flag
unauthorized entry, parking overstays, and incorrect slot occupation.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

class ViolationRuleEngine:
    RULES = [
        {
            "id": "RULE-01",
            "name": "Unauthorized Corporate Bay Entry",
            "severity": "HIGH",
            "fine": 500.0,
            "description": "Vehicle entered corporate or restricted parking without verified employee RFID clearance."
        },
        {
            "id": "RULE-02",
            "name": "Slot Overstay Expiration",
            "severity": "MEDIUM",
            "fine": 300.0,
            "description": "Vehicle remained in parking bay exceeding reserved pass duration by > 30 minutes."
        },
        {
            "id": "RULE-03",
            "name": "Non-EV Vehicle in Fast Charging Bay",
            "severity": "MEDIUM",
            "fine": 400.0,
            "description": "Internal combustion vehicle parked in dedicated EV fast-charging stall without active charge session."
        },
        {
            "id": "RULE-04",
            "name": "Access Ramp Obstruction",
            "severity": "HIGH",
            "fine": 750.0,
            "description": "Vehicle parked in designated no-parking fire lane or two-way vehicle access ramp."
        }
    ]

    @classmethod
    def evaluate_entry_event(
        cls,
        zone_category: str,
        vehicle_plate: str,
        user_company_id: Optional[str],
        zone_company_id: Optional[str],
        user_has_zone_clearance: bool
    ) -> Optional[Dict[str, Any]]:
        # If public zone, unrestricted
        if zone_category == "PUBLIC":
            return None

        # If corporate zone, evaluate company match
        if zone_category in ("PRIVATE_COMPANY", "PRIVATE_RESTRICTED"):
            u_comp = (user_company_id or "").lower().replace("comp-", "")
            z_comp = (zone_company_id or "").lower().replace("comp-", "")
            
            if not u_comp or (u_comp != z_comp and not user_has_zone_clearance):
                rule = cls.RULES[0]
                return {
                    "violation_detected": True,
                    "rule_id": rule["id"],
                    "violation_type": rule["name"],
                    "severity": rule["severity"],
                    "fine_amount": rule["fine"],
                    "description": f"Vehicle {vehicle_plate} breached corporate gate without active {zone_company_id or 'partner'} clearance."
                }
        return None

    @classmethod
    def evaluate_overstay_event(cls, reservation_end_time: datetime, current_time: Optional[datetime] = None) -> Optional[Dict[str, Any]]:
        current_time = current_time or datetime.utcnow()
        if current_time > (reservation_end_time + timedelta(minutes=30)):
            overstay_minutes = int((current_time - reservation_end_time).total_seconds() / 60)
            rule = cls.RULES[1]
            return {
                "violation_detected": True,
                "rule_id": rule["id"],
                "violation_type": rule["name"],
                "severity": rule["severity"],
                "fine_amount": rule["fine"],
                "description": f"Vehicle overstayed reserved slot by {overstay_minutes} minutes past validity."
            }
        return None
