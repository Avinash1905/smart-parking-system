"""
SmartPark Rooftop Gale Wind Barrier & Anemometer Service
Controls motorized aerodynamic glass windscreens to shield rooftop vehicles from storm wind damage.
"""

from typing import Dict, Any, List
from server.database.repositories.gale_barrier_repository import GaleBarrierRepository

class GaleBarrierService:
    @staticmethod
    def get_wind_metrics(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = GaleBarrierRepository.get_latest(zone_id)
        return {
            "success": True,
            "anemometer": node.to_dict(),
            "max_gust_recorded_today_knots": 28.4,
            "baffle_motor_drive": "NOMINAL_ACTIVE"
        }
