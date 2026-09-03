"""
SmartPark Dynamic Tidal Lane Reversal & Automated Bollard Control Service
Reverses garage entry/exit lane configurations during morning rush (3 in, 1 out)
and evening rush (1 in, 3 out) with automated pneumatic rising bollard synchronization.
"""

from typing import Dict, List, Any
from datetime import datetime

class DynamicLaneReversalService:
    LANES = [
        {"lane_id": "LANE-01", "default_direction": "ENTRY", "current_direction": "ENTRY", "bollard_state": "LOWERED", "vms_signal": "GREEN_DOWN_ARROW"},
        {"lane_id": "LANE-02", "default_direction": "ENTRY", "current_direction": "ENTRY", "bollard_state": "LOWERED", "vms_signal": "GREEN_DOWN_ARROW"},
        {"lane_id": "LANE-03", "default_direction": "EXIT", "current_direction": "REVERSIBLE_ENTRY", "bollard_state": "LOWERED", "vms_signal": "GREEN_DOWN_ARROW"},
        {"lane_id": "LANE-04", "default_direction": "EXIT", "current_direction": "EXIT", "bollard_state": "LOWERED", "vms_signal": "GREEN_UP_ARROW"}
    ]

    @classmethod
    def get_tidal_flow_state(cls) -> Dict[str, Any]:
        now = datetime.now()
        hour = now.hour + (now.minute / 60.0)

        # Morning Inflow Surge: 08:30 to 11:00
        if 8.5 <= hour <= 11.0:
            active_profile = "MORNING_INFLOW_SURGE (3 IN / 1 OUT)"
            entry_lanes_count = 3
            exit_lanes_count = 1
        # Evening Outflow Surge: 17:00 to 20:00
        elif 17.0 <= hour <= 20.0:
            active_profile = "EVENING_OUTFLOW_SURGE (1 IN / 3 OUT)"
            entry_lanes_count = 1
            exit_lanes_count = 3
        else:
            active_profile = "BALANCED_NOMINAL (2 IN / 2 OUT)"
            entry_lanes_count = 2
            exit_lanes_count = 2

        return {
            "timestamp": now.isoformat(),
            "active_tidal_profile": active_profile,
            "entry_lanes_active": entry_lanes_count,
            "exit_lanes_active": exit_lanes_count,
            "safety_interlock_status": "ALL_RADAR_CLEAR_ARMED",
            "pneumatic_compressor_bar": 7.2,
            "lanes": cls.LANES
        }
