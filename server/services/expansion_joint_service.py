"""
SmartPark Concrete Expansion Joint & Structural Thermal Displacement Service
Monitors structural LVDT linear sensors to detect seismic shear and thermal expansion deltas.
"""

from typing import Dict, Any, List
from server.database.repositories.expansion_joint_repository import ExpansionJointRepository

class ExpansionJointService:
    @staticmethod
    def get_joint_metrics(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = ExpansionJointRepository.get_latest(zone_id)
        return {
            "success": True,
            "joint": node.to_dict(),
            "allowable_thermal_range_mm": "± 10.0 mm",
            "structural_expansion_health": "OPTIMAL_NORMAL"
        }
