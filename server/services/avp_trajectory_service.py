"""
SmartPark Autonomous Valet Parking (AVP Level 4) Path Planning Service
Transmits high-definition centimeter-accurate trajectory splines to self-driving vehicles entering the deck.
"""

from typing import Dict, Any, List
from server.database.repositories.avp_trajectory_repository import AVPTrajectoryRepository, AVPTrajectoryMission

class AVPTrajectoryService:
    @staticmethod
    def get_avp_missions() -> List[Dict[str, Any]]:
        missions = AVPTrajectoryRepository.list_all()
        if not missions:
            sample = [
                AVPTrajectoryMission(mission_code="AVP-MIS-4820", vehicle_plate="KA-01-EQ-9988", dropoff_bay="VALET-DROP-01", target_parking_stall="B2-DEEP-44", trajectory_length_meters=184.5)
            ]
            for s in sample:
                AVPTrajectoryRepository.create(s)
            missions = AVPTrajectoryRepository.list_all()

        return [m.to_dict() for m in missions]
