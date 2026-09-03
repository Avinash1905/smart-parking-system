"""
SmartPark Elevator & Vertical Mobility Predictive Health Service
Monitors passenger elevator hoist motor vibrations and millimeter leveling accuracy.
"""

from typing import Dict, Any, List
from server.database.repositories.elevator_health_repository import ElevatorHealthRepository, ElevatorHealthNode

class ElevatorHealthService:
    @staticmethod
    def get_elevators_status() -> List[Dict[str, Any]]:
        nodes = ElevatorHealthRepository.list_all()
        if not nodes:
            sample = [
                ElevatorHealthNode(elevator_code="ELEV-TRACTION-01", location_label="North Core Elevator", current_floor="Floor G"),
                ElevatorHealthNode(elevator_code="ELEV-TRACTION-02", location_label="South Core Elevator", current_floor="Floor B2")
            ]
            for s in sample:
                ElevatorHealthRepository.create(s)
            nodes = ElevatorHealthRepository.list_all()

        return [n.to_dict() for n in nodes]
