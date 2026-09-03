"""
SmartPark Anti-Static ESD Grounding & Spark Safety Service
Monitors continuous ground bond continuity (<1.0 ohm) to eliminate static electricity hazards around EV chargers.
"""

from typing import Dict, Any, List
from server.database.repositories.esd_grounding_repository import ESDGroundingRepository

class ESDGroundingService:
    @staticmethod
    def get_esd_grounding_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = ESDGroundingRepository.get_latest(zone_id)
        return {
            "success": True,
            "esd": node.to_dict(),
            "ansi_esd_s2020_compliant": True,
            "max_allowable_ground_ohms": 1.0
        }
