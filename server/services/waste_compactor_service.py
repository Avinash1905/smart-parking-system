"""
SmartPark Underground Waste Compactor & Bin Fill Service
Coordinates hydraulic trash compaction and triggers automated municipal waste pickup dispatches.
"""

from typing import Dict, Any, List
from server.database.repositories.waste_compactor_repository import WasteCompactorRepository

class WasteCompactorService:
    @staticmethod
    def get_compactor_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        unit = WasteCompactorRepository.get_latest(zone_id)
        return {
            "success": True,
            "compactor": unit.to_dict(),
            "volume_reduction_ratio": "5:1",
            "next_collection_pickup": "Tomorrow, 06:00 AM"
        }
