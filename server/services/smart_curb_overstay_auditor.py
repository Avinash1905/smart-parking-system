"""
SmartPark Dynamic Curb Overstay Compliance & Fine Escalation Auditor
Audits street curb sessions, calculates overstay durations past permitted commercial loading limits,
and generates digital parking infraction citations automatically.
"""

from typing import Dict, List, Any
import uuid
from datetime import datetime

class SmartCurbOverstayAuditor:
    @staticmethod
    def audit_dwell_compliance(
        permit_token: str,
        vehicle_plate: str,
        curb_zone: str,
        allocated_minutes: int,
        actual_elapsed_minutes: int
    ) -> Dict[str, Any]:
        overstay_minutes = max(0, actual_elapsed_minutes - allocated_minutes)
        is_violation = overstay_minutes > 5  # 5 min grace period

        citation_amount = 0.0
        if is_violation:
            citation_amount = 250.0 + (overstay_minutes * 10.0)

        return {
            "permit_token": permit_token,
            "vehicle_plate": vehicle_plate.upper(),
            "curb_zone": curb_zone,
            "allocated_limit_mins": allocated_minutes,
            "actual_elapsed_mins": actual_elapsed_minutes,
            "overstay_minutes": overstay_minutes,
            "is_in_violation": is_violation,
            "assessed_citation_amount_inr": citation_amount,
            "citation_id": f"CIT-CURB-{uuid.uuid4().hex[:6].upper()}" if is_violation else None,
            "timestamp": datetime.now().isoformat()
        }
