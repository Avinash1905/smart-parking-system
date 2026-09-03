"""
SmartPark Rooftop Hydronic Snow Melt Glycol Circulation Pump Service
Pumps 48.5°C heated propylene glycol through embedded slab tubing to melt rooftop snowfall at 650 kBTU/hr.
"""

from typing import Dict, Any, List
from server.database.repositories.glycol_circulation_repository import GlycolCirculationRepository

class GlycolCirculationService:
    @staticmethod
    def get_glycol_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = GlycolCirculationRepository.get_latest(zone_id)
        return {
            "success": True,
            "glycol_circulation": node.to_dict(),
            "anti_freeze_protection_temp_celsius": -28.0,
            "boiler_efficiency_afue_pct": 96.5
        }
