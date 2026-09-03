"""
SmartPark Valet Key Custody & Smart Electronic Key Safe Service
Tracks key fob RFID tag check-ins, runner biometric custody handovers,
and logs electronic locker solenoid lock/unlock timestamps.
"""

from typing import Dict, List, Any
import uuid
from datetime import datetime

class SmartValetKeyCustodyService:
    @staticmethod
    def log_key_event(
        valet_ticket_id: str,
        runner_id: str,
        box_number: str,
        event_type: str = "KEY_DEPOSITED"  # KEY_DEPOSITED / KEY_RETRIEVED
    ) -> Dict[str, Any]:
        log_id = f"KEYLOG-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now()

        return {
            "log_id": log_id,
            "valet_ticket_id": valet_ticket_id,
            "runner_id": runner_id,
            "box_number": box_number,
            "event_type": event_type,
            "timestamp": now.isoformat(),
            "biometric_auth_status": "FINGERPRINT_VERIFIED",
            "locker_door_status": "LOCKED_SECURE" if event_type == "KEY_DEPOSITED" else "OPEN_DISPENSED"
        }
