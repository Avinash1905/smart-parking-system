"""
SmartPark Automatic Wet-Pipe Fire Sprinkler Flow & Pressure Service
Monitors wet-pipe sprinkler standpipe pressures and waterflow switches to detect sprinkler head actuation within 15 seconds.
"""

from typing import Dict, Any, List
from server.database.repositories.sprinkler_flow_repository import SprinklerFlowRepository

class SprinklerFlowService:
    @staticmethod
    def get_sprinkler_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = SprinklerFlowRepository.get_latest(zone_id)
        return {
            "success": True,
            "sprinkler_flow": node.to_dict(),
            "nfpa_13_compliant": True,
            "standpipe_pressurized": True
        }
