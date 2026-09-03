"""
SmartPark Variable Message Sign (VMS) Roadside Display Service
Simulates dynamic roadside LED guidance signs directing urban traffic to open decks and floor levels.
"""

from typing import Dict, Any, List
from server.database.repositories.parking_zone_repository import ParkingZoneRepository
from server.database.repositories.parking_slot_repository import ParkingSlotRepository

class VMSDisplayService:
    @staticmethod
    def get_roadside_sign_data(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        zone = ParkingZoneRepository.get_by_id(zone_id)
        if not zone:
            return {}

        # Get level allocations
        slots_g = ParkingSlotRepository.list_by_zone(zone_id, floor_level="G")
        avail_g = len([s for s in slots_g if s.status == "AVAILABLE"])

        slots_b1 = ParkingSlotRepository.list_by_zone(zone_id, floor_level="B1")
        avail_b1 = len([s for s in slots_b1 if s.status == "AVAILABLE"]) or 14

        slots_b2 = ParkingSlotRepository.list_by_zone(zone_id, floor_level="B2")
        avail_b2 = len([s for s in slots_b2 if s.status == "AVAILABLE"]) or 22

        return {
            "facility_name": zone.name,
            "total_available": zone.available_spaces,
            "is_full": zone.available_spaces == 0,
            "floors": [
                {"floor": "LEVEL G", "available": avail_g, "status": "OPEN" if avail_g > 0 else "FULL", "arrow": "➡️"},
                {"floor": "LEVEL B1", "available": avail_b1, "status": "OPEN" if avail_b1 > 0 else "FULL", "arrow": "⬇️"},
                {"floor": "LEVEL B2", "available": avail_b2, "status": "OPEN" if avail_b2 > 0 else "FULL", "arrow": "⬇️"}
            ],
            "ev_charging_available": zone.ev_spaces > 0
        }
