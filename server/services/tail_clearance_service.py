"""
SmartPark Vehicle Rear Bumper Overhang & Tail Clearance Service
Measures bumper protrusion past stall boundaries to prevent obstruction of 2-way drive aisles.
"""

from typing import Dict, Any, List
from server.database.repositories.tail_clearance_repository import TailClearanceRepository

class TailClearanceService:
    @staticmethod
    def get_overhang_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = TailClearanceRepository.get_latest(zone_id)
        return {
            "success": True,
            "tail_clearance": node.to_dict(),
            "curtain_beam_count": 16,
            "clearance_sensor_accuracy_mm": 5.0
        }
