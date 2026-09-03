"""
SmartPark Autonomous Patrol Drone Docking & Flight Dispatch Service
Coordinates rooftop hangar door actuation and thermal perimeter surveillance drone missions.
"""

from typing import Dict, Any, List
from server.database.repositories.patrol_drone_repository import PatrolDroneRepository

class PatrolDroneService:
    @staticmethod
    def get_hangar_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        hangar = PatrolDroneRepository.get_latest(zone_id)
        return {
            "success": True,
            "hangar": hangar.to_dict(),
            "max_wind_speed_knots_limit": 25.0,
            "current_roof_wind_knots": 8.4,
            "flight_go_condition": True
        }
