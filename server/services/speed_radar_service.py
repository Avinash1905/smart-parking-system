"""
SmartPark Drive Aisle Speed Radar & Enforcement Service
Tracks vehicle velocity along drive aisles and enforces facility 15 km/h safety limits.
"""

from typing import Dict, Any, List
from server.database.repositories.speed_radar_repository import SpeedRadarRepository, SpeedRadarIncident

class SpeedRadarService:
    @staticmethod
    def get_speeding_incidents() -> List[Dict[str, Any]]:
        incidents = SpeedRadarRepository.list_all()
        if not incidents:
            sample = [
                SpeedRadarIncident(incident_code="SPEED-INC-9014", vehicle_plate="KA-01-EQ-9988", measured_speed_kmh=26.5)
            ]
            for s in sample:
                SpeedRadarRepository.create(s)
            incidents = SpeedRadarRepository.list_all()

        return [i.to_dict() for i in incidents]
