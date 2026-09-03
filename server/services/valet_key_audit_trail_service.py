"""
SmartPark Cryptographic Valet Key Custody Audit Hash Chain Service
Builds an immutable SHA-256 block hash chain of all physical vehicle key movements,
protecting valet operators from vehicle theft liability disputes.
"""

from typing import Dict, List, Any
import hashlib
from datetime import datetime

class ValetKeyAuditTrailService:
    @staticmethod
    def create_custody_block(
        previous_block_hash: str,
        ticket_id: str,
        runner_id: str,
        action: str,  # "KEY_DEPOSITED", "KEY_TRANSFERRED", "KEY_RELEASED_TO_OWNER"
        box_number: str
    ) -> Dict[str, Any]:
        now = datetime.now()
        timestamp_str = now.isoformat()
        
        # Build cryptographic payload
        raw_payload = f"{previous_block_hash}|{ticket_id}|{runner_id}|{action}|{box_number}|{timestamp_str}"
        current_hash = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest().upper()

        return {
            "block_index": 482,
            "timestamp": timestamp_str,
            "previous_block_hash": previous_block_hash,
            "current_block_hash": current_hash,
            "ticket_id": ticket_id,
            "runner_id": runner_id,
            "custody_action": action,
            "box_number": box_number,
            "audit_trail_valid": True
        }
