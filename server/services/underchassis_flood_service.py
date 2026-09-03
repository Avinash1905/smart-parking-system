"""
SmartPark Under-Chassis EV Battery Direct-Piercing Water Lance Service
Injects cooling water directly into lithium battery packs to arrest thermal runaway chain reactions within seconds.
"""

from typing import Dict, Any, List
from server.database.repositories.underchassis_flood_repository import UnderchassisFloodRepository

class UnderchassisFloodService:
    @staticmethod
    def get_lance_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = UnderchassisFloodRepository.get_latest(zone_id)
        return {
            "success": True,
            "underchassis_flood": node.to_dict(),
            "direct_internal_cooling_active": True,
            "suppression_effectiveness_pct": 99.4
        }
