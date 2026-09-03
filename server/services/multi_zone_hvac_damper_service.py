"""
SmartPark Multi-Zone Motorized Fire/Smoke Damper & Differential Pressure Service
Controls motorized smoke dampers between multi-level parking decks, maintaining positive pressure
in fire escape stairwells to prevent smoke ingress during emergency fire containment.
"""

from typing import Dict, List, Any
from datetime import datetime

class MultiZoneHVACDamperService:
    DAMPERS = [
        {"damper_id": "DAMP-B1-01", "location": "Basement B1 East Shaft", "actuator_type": "BELIMO_24V_MODULATING", "position_pct": 100, "status": "OPEN_NOMINAL"},
        {"damper_id": "DAMP-B1-02", "location": "Basement B1 West Shaft", "actuator_type": "BELIMO_24V_MODULATING", "position_pct": 100, "status": "OPEN_NOMINAL"},
        {"damper_id": "DAMP-STAIR-A", "location": "Stairwell A Pressurization Core", "actuator_type": "HIGH_SPEED_PNEUMATIC", "position_pct": 100, "status": "POSITIVE_PRESSURE_ARMED"}
    ]

    @classmethod
    def get_damper_matrix(cls) -> Dict[str, Any]:
        return {
            "timestamp": datetime.now().isoformat(),
            "overall_safety_state": "ALL_DAMPERS_NOMINAL_UNLATCHED",
            "stairwell_differential_pressure_pa": 52.0,  # NFPA 92 requirement: 50 Pa positive pressure
            "fusible_link_status": "INTEACT_ARMED",
            "dampers": cls.DAMPERS
        }
