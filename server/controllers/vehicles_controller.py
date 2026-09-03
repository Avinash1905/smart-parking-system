"""
SmartPark Vehicles & Garage REST Controller
Handles vehicle registration, default selection, and EV compatibility verification.
"""

import uuid
from typing import Dict, Any, List
from server.database.repositories.vehicle_repository import VehicleRepository
from server.middleware.error_handler import NotFoundException, ValidationException
from server.models.schema import Vehicle

class VehiclesController:
    @staticmethod
    def list_user_vehicles(user_id: str) -> Dict[str, Any]:
        vehicles = VehicleRepository.list_by_user(user_id)
        return {"success": True, "count": len(vehicles), "data": [v.to_dict() for v in vehicles]}

    @staticmethod
    def add_vehicle(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        plate = data.get("registration_plate", "").upper().strip()
        if not plate:
            raise ValidationException("License plate is required.")

        veh_id = f"veh-{uuid.uuid4().hex[:8]}"
        veh_type = data.get("vehicle_type", "CAR")
        is_ev = "EV" in veh_type or bool(data.get("is_ev", False))

        new_v = Vehicle(
            id=veh_id,
            user_id=user_id,
            registration_plate=plate,
            vehicle_type=veh_type,
            brand=data.get("brand", "Standard"),
            model=data.get("model", "Car"),
            color=data.get("color", "Standard"),
            is_ev=is_ev,
            fast_charge_compatible=is_ev,
            is_default=bool(data.get("is_default", False))
        )

        VehicleRepository.create(new_v)
        return {"success": True, "vehicle_id": veh_id, "data": new_v.to_dict()}

    @staticmethod
    def set_default(user_id: str, vehicle_id: str) -> Dict[str, Any]:
        success = VehicleRepository.set_default(user_id, vehicle_id)
        if not success:
            raise NotFoundException("Vehicle", vehicle_id)
        return {"success": True, "message": "Default vehicle updated."}
