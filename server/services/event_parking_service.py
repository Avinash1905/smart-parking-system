"""
SmartPark Special Event & Stadium Parking Service
Handles high-demand game-day and concert parking passes with express exit lanes.
"""

from typing import Dict, Any, List
from server.database.repositories.event_parking_repository import EventParkingRepository, SpecialEventParking

class EventParkingService:
    @staticmethod
    def get_active_events() -> List[Dict[str, Any]]:
        events = EventParkingRepository.list_active()
        if not events:
            sample = [
                SpecialEventParking(event_name="IPL T20 Cricket (Chinnaswamy Stadium)", venue_name="Chinnaswamy Stadium", event_date="Tonight, 07:00 PM", fixed_event_tariff=200.0, available_event_passes=38),
                SpecialEventParking(event_name="International Music Festival (Palace Grounds)", venue_name="Bangalore Palace Grounds", event_date="Saturday, 05:00 PM", fixed_event_tariff=250.0, available_event_passes=84)
            ]
            for s in sample:
                EventParkingRepository.create(s)
            events = EventParkingRepository.list_active()

        return [e.to_dict() for e in events]
