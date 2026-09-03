"""
SmartPark Visitor Access & Corporate Guest Pass REST Controller
Handles visitor pre-clearance, digital badge issuance, and temporary parking authorizations.
"""

from typing import Dict, Any, List
import uuid
from datetime import datetime, timedelta

_VISITOR_PASSES = []

class VisitorAccessController:
    @staticmethod
    def create_guest_pass(host_user_id: str, guest_name: str, guest_plate: str, zone_id: str, duration_hours: float = 4.0) -> Dict[str, Any]:
        pass_id = f"GUEST-{uuid.uuid4().hex[:8].upper()}"
        now = datetime.now()
        valid_until = now + timedelta(hours=duration_hours)

        guest_pass = {
            "pass_id": pass_id,
            "host_user_id": host_user_id,
            "guest_name": guest_name,
            "guest_plate": guest_plate.upper(),
            "zone_id": zone_id,
            "issued_at": now.isoformat(),
            "valid_until": valid_until.isoformat(),
            "status": "ACTIVE",
            "qr_token": f"VQR-{uuid.uuid4().hex[:12].upper()}"
        }
        _VISITOR_PASSES.append(guest_pass)
        return {"success": True, "data": guest_pass}

    @staticmethod
    def list_guest_passes(host_user_id: str = "") -> Dict[str, Any]:
        if host_user_id:
            filtered = [p for p in _VISITOR_PASSES if p["host_user_id"] == host_user_id]
        else:
            filtered = _VISITOR_PASSES
        return {"success": True, "count": len(filtered), "data": filtered}
