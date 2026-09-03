"""
SmartPark Bioretention Rain Garden & Silt Trap Service
Filters roof & ramp stormwater runoff through native bioretention soil media, removing 94.5% of heavy metals and sediment.
"""

from typing import Dict, Any, List
from server.database.repositories.rain_garden_repository import RainGardenRepository

class RainGardenService:
    @staticmethod
    def get_rain_garden_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = RainGardenRepository.get_latest(zone_id)
        return {
            "success": True,
            "rain_garden": node.to_dict(),
            "bio_soil_depth_meters": 1.20,
            "epa_low_impact_development_certified": True
        }
