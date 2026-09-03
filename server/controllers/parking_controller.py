"""
SmartPark Parking Facilities & Slot Controller
Handles public/private parking queries, bay matrices, predictions, and tariff updates.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.parking_zone_repository import ParkingZoneRepository
from server.database.repositories.parking_slot_repository import ParkingSlotRepository
from server.engines.ml_prediction_engine import MLPredictionEngine
from server.middleware.error_handler import NotFoundException

class ParkingController:
    @staticmethod
    def get_public_zones() -> Dict[str, Any]:
        zones = ParkingZoneRepository.list_all(category="PUBLIC")
        return {"success": True, "count": len(zones), "data": [z.to_dict() for z in zones]}

    @staticmethod
    def get_private_zones(user: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        all_zones = ParkingZoneRepository.list_all()
        private_zones = [z for z in all_zones if z.category != "PUBLIC"]
        return {"success": True, "count": len(private_zones), "data": [z.to_dict() for z in private_zones]}

    @staticmethod
    def get_zone_by_id(zone_id: str) -> Dict[str, Any]:
        zone = ParkingZoneRepository.get_by_id(zone_id)
        if not zone:
            raise NotFoundException("ParkingZone", zone_id)
        return {"success": True, "data": zone.to_dict()}

    @staticmethod
    def get_zone_slots(zone_id: str, floor: Optional[str] = None) -> Dict[str, Any]:
        zone = ParkingZoneRepository.get_by_id(zone_id)
        if not zone:
            raise NotFoundException("ParkingZone", zone_id)

        slots = ParkingSlotRepository.list_by_zone(zone_id, floor_level=floor)
        return {"success": True, "count": len(slots), "data": [s.to_dict() for s in slots]}

    @staticmethod
    def get_zone_prediction(zone_id: str) -> Dict[str, Any]:
        zone = ParkingZoneRepository.get_by_id(zone_id)
        if not zone:
            raise NotFoundException("ParkingZone", zone_id)

        pred = MLPredictionEngine.predict_occupancy(
            current_occupied=zone.occupied_spaces,
            total_capacity=zone.total_spaces,
            category=zone.category
        )
        return {"success": True, "zone_id": zone_id, "data": pred}
