"""
SmartPark Multi-Lane ANPR Synchronization & Anti-Tailgating Tracking Service
Tracks simultaneous vehicle passages across parallel entry/exit lanes,
detects tailgating vehicles drafting behind authorized barriers, and triggers optical entrapment alarms.
"""

from typing import Dict, List, Any
from datetime import datetime

class ANPRMultiLaneSynchronizer:
    @staticmethod
    def evaluate_tailgating_risk(
        gate_id: str,
        lead_vehicle_plate: str,
        rear_vehicle_plate: str,
        time_gap_seconds: float,
        barrier_status: str = "CLOSING"
    ) -> Dict[str, Any]:
        """Flags tailgating events when second vehicle enters within < 1.2s without clearance."""
        is_tailgating = time_gap_seconds < 1.2

        return {
            "gate_id": gate_id,
            "timestamp": datetime.now().isoformat(),
            "lead_vehicle_plate": lead_vehicle_plate.upper(),
            "rear_vehicle_plate": rear_vehicle_plate.upper(),
            "inter_vehicle_time_gap_seconds": time_gap_seconds,
            "tailgating_infraction_detected": is_tailgating,
            "security_action": "PHOTO_ENFORCEMENT_DISPATCH" if is_tailgating else "CLEAR_PASSAGE",
            "barrier_safety_beam": "EMERGENCY_RE_OPEN" if is_tailgating else barrier_status
        }
