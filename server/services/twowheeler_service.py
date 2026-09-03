"""
SmartPark Two-Wheeler & EV Motorcycle Stacking Dock Service
Coordinates micro-parking spaces, smart helmet lockers, and EV battery swap stations.
"""

from typing import Dict, Any, List
from server.database.repositories.twowheeler_repository import TwoWheelerRepository, TwoWheelerBay

class TwoWheelerService:
    @staticmethod
    def get_two_wheeler_bays(zone_id: str = "zone-pub-01") -> List[Dict[str, Any]]:
        bays = TwoWheelerRepository.list_by_zone(zone_id)
        if not bays:
            sample = [
                TwoWheelerBay(bay_code="2W-BAY-01", zone_id=zone_id, vehicle_type="ELECTRIC_SCOOTER", helmet_locker_code="HL-401", status="AVAILABLE"),
                TwoWheelerBay(bay_code="2W-BAY-02", zone_id=zone_id, vehicle_type="MOTORCYCLE", helmet_locker_code="HL-402", status="AVAILABLE"),
                TwoWheelerBay(bay_code="2W-BAY-03", zone_id=zone_id, vehicle_type="ELECTRIC_SCOOTER", helmet_locker_code="HL-403", status="OCCUPIED")
            ]
            for s in sample:
                TwoWheelerRepository.create(s)
            bays = TwoWheelerRepository.list_by_zone(zone_id)

        return [b.to_dict() for b in bays]
