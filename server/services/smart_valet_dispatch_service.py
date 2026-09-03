"""
SmartPark Automated Valet Parking (AVP) & Key Locker Dispatch Service
Manages digital valet ticket issuance, automated key locker assignments,
vehicle retrieval queuing, and runner staff dispatch optimization.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime, timedelta

_VALET_SESSIONS: Dict[str, Dict[str, Any]] = {}

class SmartValetDispatchService:
    @staticmethod
    def request_valet_dropoff(
        driver_name: str,
        vehicle_plate: str,
        phone: str,
        preferred_retrieval_time: Optional[str] = None
    ) -> Dict[str, Any]:
        ticket_id = f"VAL-{uuid.uuid4().hex[:6].upper()}"
        key_locker_box = f"BOX-{(len(_VALET_SESSIONS) % 30) + 1:02d}"
        staging_bay = f"STAGING-{(len(_VALET_SESSIONS) % 8) + 1:02d}"
        now = datetime.now()

        valet_ticket = {
            "ticket_id": ticket_id,
            "driver_name": driver_name,
            "vehicle_plate": vehicle_plate.upper(),
            "phone": phone,
            "key_locker_box": key_locker_box,
            "staging_bay": staging_bay,
            "checked_in_at": now.isoformat(),
            "status": "KEY_DEPOSITED",
            "valet_runner_assigned": "Staff Runner #04",
            "final_parked_slot": None,
            "retrieval_requested": False,
            "digital_claim_url": f"https://smartpark.city/valet/claim/{ticket_id}"
        }

        _VALET_SESSIONS[ticket_id] = valet_ticket
        return {"success": True, "ticket": valet_ticket}

    @staticmethod
    def park_vehicle(ticket_id: str, assigned_slot: str, runner_id: str) -> Dict[str, Any]:
        if ticket_id not in _VALET_SESSIONS:
            return {"success": False, "message": "Valet ticket not found"}
        
        ticket = _VALET_SESSIONS[ticket_id]
        ticket["status"] = "PARKED"
        ticket["final_parked_slot"] = assigned_slot
        ticket["valet_runner_assigned"] = runner_id
        ticket["parked_at"] = datetime.now().isoformat()
        return {"success": True, "ticket": ticket}

    @staticmethod
    def request_retrieval(ticket_id: str) -> Dict[str, Any]:
        if ticket_id not in _VALET_SESSIONS:
            return {"success": False, "message": "Valet ticket not found"}
        
        ticket = _VALET_SESSIONS[ticket_id]
        ticket["status"] = "RETRIEVAL_IN_PROGRESS"
        ticket["retrieval_requested"] = True
        ticket["retrieval_requested_at"] = datetime.now().isoformat()
        ticket["estimated_ready_minutes"] = 4
        return {"success": True, "ticket": ticket, "message": "Vehicle retrieval initiated. Ready at Valet Staging in ~4 mins."}

    @staticmethod
    def list_active_valet() -> List[Dict[str, Any]]:
        return list(_VALET_SESSIONS.values())
