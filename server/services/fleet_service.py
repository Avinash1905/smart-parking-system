"""
SmartPark Commercial Fleet & Loading Dock Management Service
Handles commercial dispatch slots, loading bay reservations, and fleet driver allocations.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.fleet_repository import FleetRepository, FleetVehicle
from server.database.repositories.audit_log_repository import AuditLogRepository
from server.models.schema import AuditLog

class FleetService:
    @staticmethod
    def get_fleet_vehicles() -> List[Dict[str, Any]]:
        vehicles = FleetRepository.list_all()
        if not vehicles:
            # Seed default logistics fleet
            sample = [
                FleetVehicle(fleet_operator_id="fleet-amazon", operator_name="Amazon Prime Logistics", vehicle_plate="KA-01-FL-1001", vehicle_type="DELIVERY_VAN", driver_name="Ramesh Kumar", assigned_dock_id="DOCK-01", status="DOCKED"),
                FleetVehicle(fleet_operator_id="fleet-flipkart", operator_name="Flipkart Quick Fleet", vehicle_plate="KA-05-FL-4088", vehicle_type="ELECTRIC_TRUCK", driver_name="Amit Patel", assigned_dock_id="DOCK-02", status="IN_TRANSIT"),
                FleetVehicle(fleet_operator_id="fleet-dhl", operator_name="DHL Express Expressway", vehicle_plate="KA-03-FL-7711", vehicle_type="DELIVERY_VAN", driver_name="Sunil Rao", assigned_dock_id="DOCK-03", status="IN_TRANSIT")
            ]
            for s in sample:
                FleetRepository.create(s)
            vehicles = FleetRepository.list_all()

        return [v.to_dict() for v in vehicles]

    @staticmethod
    def register_fleet_vehicle(data: Dict[str, Any], admin_id: str = "adm-001") -> Dict[str, Any]:
        veh = FleetVehicle(
            fleet_operator_id=data.get("fleet_operator_id", "fleet-generic"),
            operator_name=data.get("operator_name", "Commercial Delivery Fleet"),
            vehicle_plate=data["vehicle_plate"].upper().strip(),
            vehicle_type=data.get("vehicle_type", "DELIVERY_VAN"),
            driver_name=data["driver_name"],
            driver_phone=data.get("driver_phone", "+91 98000 00000"),
            assigned_dock_id=data.get("assigned_dock_id", "DOCK-01"),
            status="IN_TRANSIT"
        )
        FleetRepository.create(veh)

        AuditLogRepository.create(AuditLog(
            user_id=admin_id,
            user_email="admin@smartpark.com",
            action="FLEET_VEHICLE_REGISTERED",
            resource_type="FleetVehicle",
            resource_id=veh.id,
            details={"plate": veh.vehicle_plate, "operator": veh.operator_name}
        ))

        return {"success": True, "fleet_vehicle_id": veh.id, "data": veh.to_dict()}
