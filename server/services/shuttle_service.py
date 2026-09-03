"""
SmartPark Campus Electric Shuttle & First/Last Mile Micro-Mobility Service
Coordinates electric shuttles connecting corporate parking decks with office towers and tech hubs.
"""

from typing import Dict, Any, List
from server.database.repositories.shuttle_repository import ShuttleRepository, CampusShuttleRoute

class ShuttleService:
    @staticmethod
    def get_shuttle_routes() -> List[Dict[str, Any]]:
        shuttles = ShuttleRepository.list_all()
        if not shuttles:
            sample = [
                CampusShuttleRoute(shuttle_code="SHUTTLE-E1", route_name="Think Campus Express", current_stop="Deck Alpha West Gate", next_arrival_minutes=3, capacity_seats_open=8),
                CampusShuttleRoute(shuttle_code="SHUTTLE-E2", route_name="Electronics City Phase 1 Loop", current_stop="Infosys Main Gate", next_arrival_minutes=6, capacity_seats_open=14)
            ]
            for s in sample:
                ShuttleRepository.create(s)
            shuttles = ShuttleRepository.list_all()

        return [s.to_dict() for s in shuttles]
