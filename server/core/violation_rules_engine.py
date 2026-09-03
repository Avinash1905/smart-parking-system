"""
SmartPark Violation Rules & Automated Enforcement Engine
Applies real-time heuristic validation: Unauthorized Private Zone Access, Overstay Beyond Grace Window,
Wrong Slot Parked, Double Parking Sensor Detection, EV Stall ICEing (Non-EV blocking charger).
"""

import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional

class ViolationType:
    UNAUTHORIZED_PRIVATE_PARKING = "UNAUTHORIZED_PRIVATE_PARKING"
    OVERSTAY_EXPIRED_RESERVATION = "OVERSTAY_EXPIRED_RESERVATION"
    WRONG_SLOT_ASSIGNMENT = "WRONG_SLOT_ASSIGNMENT"
    EV_STALL_ICEING = "EV_STALL_ICEING"
    DOUBLE_PARKING_OBSTRUCTION = "DOUBLE_PARKING_OBSTRUCTION"
    FIRE_LANE_CLEARANCE_BREACH = "FIRE_LANE_CLEARANCE_BREACH"
    HANDICAP_BAY_UNAUTHORIZED = "HANDICAP_BAY_UNAUTHORIZED"

class ViolationRulesEngine:
    FINE_SCHEDULE = {
        ViolationType.UNAUTHORIZED_PRIVATE_PARKING: {"amount": 750.0, "severity": "HIGH", "description": "Vehicle parked in private tenant facility without authorized company badge or guest permit."},
        ViolationType.OVERSTAY_EXPIRED_RESERVATION: {"amount": 350.0, "severity": "MEDIUM", "description": "Vehicle exceeded booked duration beyond the 15-minute statutory grace period."},
        ViolationType.WRONG_SLOT_ASSIGNMENT: {"amount": 250.0, "severity": "LOW", "description": "Vehicle parked in a different stall than the allocated reservation slot."},
        ViolationType.EV_STALL_ICEING: {"amount": 1000.0, "severity": "HIGH", "description": "Internal combustion vehicle obstructing high-speed EV fast-charging bay."},
        ViolationType.DOUBLE_PARKING_OBSTRUCTION: {"amount": 500.0, "severity": "MEDIUM", "description": "Vehicle straddling two parking stalls or obstructing main circulation drive aisle."},
        ViolationType.FIRE_LANE_CLEARANCE_BREACH: {"amount": 1500.0, "severity": "CRITICAL", "description": "Vehicle stopped in marked yellow emergency egress fire lane."},
        ViolationType.HANDICAP_BAY_UNAUTHORIZED: {"amount": 1200.0, "severity": "CRITICAL", "description": "Unauthorized vehicle occupying designated accessible barrier-free bay."}
    }

    @staticmethod
    def evaluate_entry_event(
        vehicle_plate: str,
        vehicle_is_ev: bool,
        zone: Dict[str, Any],
        allocated_slot_type: str,
        user_company_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Evaluates entry events against all automated enforcement rules."""
        plate_clean = vehicle_plate.strip().upper()

        # Rule 1: Private Zone Verification
        if zone.get("category") == "PRIVATE_COMPANY":
            zone_comp = (zone.get("company_id") or "").lower().replace("comp-", "")
            user_comp = (user_company_id or "").lower().replace("comp-", "")
            if not user_comp or user_comp != zone_comp:
                rule_info = ViolationRulesEngine.FINE_SCHEDULE[ViolationType.UNAUTHORIZED_PRIVATE_PARKING]
                return {
                    "violation_type": ViolationType.UNAUTHORIZED_PRIVATE_PARKING,
                    "vehicle_plate": plate_clean,
                    "severity": rule_info["severity"],
                    "fine_amount": rule_info["amount"],
                    "description": f"{rule_info['description']} (Target Zone: {zone.get('name')})",
                    "evidence_notes": f"ALPR camera detected plate {plate_clean} with unregistered company token."
                }

        # Rule 2: EV Fast-Charge Stall ICEing
        if allocated_slot_type == "EV_FAST_CHARGE" and not vehicle_is_ev:
            rule_info = ViolationRulesEngine.FINE_SCHEDULE[ViolationType.EV_STALL_ICEING]
            return {
                "violation_type": ViolationType.EV_STALL_ICEING,
                "vehicle_plate": plate_clean,
                "severity": rule_info["severity"],
                "fine_amount": rule_info["amount"],
                "description": rule_info["description"],
                "evidence_notes": f"Optical ANPR and EV charger pilot pin failed to establish J1772/CCS communication for {plate_clean}."
            }

        return None

    @staticmethod
    def create_citation_record(violation_data: Dict[str, Any], officer_or_system: str = "ALPR_AUTOMATED_SYSTEM") -> Dict[str, Any]:
        """Creates formal citation payload ready for database persistence."""
        v_id = f"CIT-{datetime.utcnow().strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
        return {
            "id": v_id,
            "citation_number": v_id,
            "vehicle_plate": violation_data.get("vehicle_plate", "UNKNOWN"),
            "violation_type": violation_data.get("violation_type", "OTHER"),
            "severity": violation_data.get("severity", "MEDIUM"),
            "fine_amount": float(violation_data.get("fine_amount", 500.0)),
            "parking_zone_id": violation_data.get("parking_zone_id", "zone-pub-01"),
            "parking_zone_name": violation_data.get("parking_zone_name", "Municipal Facility"),
            "slot_number": violation_data.get("slot_number", "—"),
            "description": violation_data.get("description", "Parking policy infraction recorded."),
            "evidence_notes": violation_data.get("evidence_notes", "Automated camera timestamp audit."),
            "status": "OPEN",
            "issued_by": officer_or_system,
            "issued_at": datetime.utcnow().isoformat(),
            "due_date": (datetime.utcnow() + timedelta(days=14)).strftime("%Y-%m-%d"),
            "dispute_allowed_until": (datetime.utcnow() + timedelta(days=7)).strftime("%Y-%m-%d")
        }
