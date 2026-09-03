"""
SmartPark Accessible ADA & Wheelchair Parking Service
Coordinates reserved extra-wide van accessible bays located nearest to elevators with zero-step routes.
"""

from typing import Dict, Any, List
from server.database.repositories.ada_parking_repository import ADAParkingRepository, ADAParkingBay

class ADAParkingService:
    @staticmethod
    def get_ada_bays(zone_id: str = "zone-pub-01") -> List[Dict[str, Any]]:
        bays = ADAParkingRepository.list_by_zone(zone_id)
        if not bays:
            sample = [
                ADAParkingBay(slot_code="ADA-G-01", floor_level="Floor G", distance_to_elevator_meters=10, status="AVAILABLE"),
                ADAParkingBay(slot_code="ADA-G-02", floor_level="Floor G", distance_to_elevator_meters=14, status="AVAILABLE")
            ]
            for s in sample:
                ADAParkingRepository.create(s)
            bays = ADAParkingRepository.list_by_zone(zone_id)

        return [b.to_dict() for b in bays]
