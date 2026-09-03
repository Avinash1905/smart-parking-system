"""
SmartPark Pedestrian Crosswalk Safety & Collision Avoidance Service
Monitors microwave radar sensors at elevator crossings and activates LED blind-corner warning flashers.
"""

from typing import Dict, Any, List
from server.database.repositories.pedestrian_safety_repository import PedestrianRadarRepository, PedestrianRadarNode

class PedestrianSafetyService:
    @staticmethod
    def get_safety_nodes() -> List[Dict[str, Any]]:
        nodes = PedestrianRadarRepository.list_all()
        if not nodes:
            sample = [
                PedestrianRadarNode(crosswalk_code="CW-ELEV-LOBBY-01", floor_level="Floor G", warning_flasher_status="STANDBY"),
                PedestrianRadarNode(crosswalk_code="CW-B1-RAMP-02", floor_level="Floor B1", warning_flasher_status="STANDBY")
            ]
            for s in sample:
                PedestrianRadarRepository.create(s)
            nodes = PedestrianRadarRepository.list_all()

        return [n.to_dict() for n in nodes]
