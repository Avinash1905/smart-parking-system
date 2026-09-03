"""
SmartPark Dynamic Axle Load & Weigh-in-Motion Service
Screens vehicle axle weights at entry gates to protect multi-deck post-tension slabs from structural overloading.
"""

from typing import Dict, Any, List
from server.database.repositories.axle_load_repository import AxleLoadRepository

class AxleLoadService:
    @staticmethod
    def get_wim_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = AxleLoadRepository.get_latest(zone_id)
        return {
            "success": True,
            "axle_load": node.to_dict(),
            "piezo_quartz_calibrated": True,
            "accuracy_class": "COST_323_CLASS_A5"
        }
