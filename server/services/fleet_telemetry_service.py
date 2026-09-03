"""
SmartPark Corporate Fleet & Enterprise Telemetry Service
Tracks corporate pool vehicles, battery state-of-charge, service intervals,
and coordinates automated bay allocations for enterprise sales & logistics fleets.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime, timedelta

class FleetTelemetryService:
    def __init__(self):
        self._fleet_registry: Dict[str, Dict[str, Any]] = {
            "FLT-001": {
                "id": "FLT-001",
                "company_id": "comp_tcs_hq",
                "vehicle_plate": "KA-01-FL-5501",
                "brand": "Tata",
                "model": "Nexon EV",
                "is_ev": True,
                "battery_soc_percent": 88,
                "odometer_km": 14250,
                "last_service_date": "2026-07-15",
                "assigned_driver": "Vikram Mehta",
                "status": "PARKED_CHARGING",
                "current_zone_id": "zone-pvt-01",
                "current_slot": "EV-04"
            },
            "FLT-002": {
                "id": "FLT-002",
                "company_id": "comp_tcs_hq",
                "vehicle_plate": "KA-01-FL-5502",
                "brand": "Hyundai",
                "model": "Kona Electric",
                "is_ev": True,
                "battery_soc_percent": 34,
                "odometer_km": 28400,
                "last_service_date": "2026-06-10",
                "assigned_driver": "Ananya Roy",
                "status": "IN_TRANSIT",
                "current_zone_id": None,
                "current_slot": None
            },
            "FLT-003": {
                "id": "FLT-003",
                "company_id": "comp_infosys_campus",
                "vehicle_plate": "KA-05-FL-8819",
                "brand": "Mahindra",
                "model": "XUV400",
                "is_ev": True,
                "battery_soc_percent": 95,
                "odometer_km": 8900,
                "last_service_date": "2026-08-01",
                "assigned_driver": "Rohan Gupta",
                "status": "PARKED_READY",
                "current_zone_id": "zone-pvt-02",
                "current_slot": "S-12"
            }
        }

    def list_fleet(self, company_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if company_id:
            return [v for v in self._fleet_registry.values() if v["company_id"] == company_id]
        return list(self._fleet_registry.values())

    def get_vehicle(self, vehicle_id: str) -> Optional[Dict[str, Any]]:
        return self._fleet_registry.get(vehicle_id)

    def register_vehicle(self, data: Dict[str, Any]) -> Dict[str, Any]:
        vid = f"FLT-{uuid.uuid4().hex[:6].upper()}"
        vehicle = {
            "id": vid,
            "company_id": data.get("company_id", "comp_generic"),
            "vehicle_plate": data.get("vehicle_plate", "KA-01-XX-0000").upper(),
            "brand": data.get("brand", "Generic"),
            "model": data.get("model", "EV Sedan"),
            "is_ev": bool(data.get("is_ev", True)),
            "battery_soc_percent": int(data.get("battery_soc_percent", 100)),
            "odometer_km": int(data.get("odometer_km", 0)),
            "last_service_date": datetime.now().strftime("%Y-%m-%d"),
            "assigned_driver": data.get("assigned_driver", "Unassigned"),
            "status": "PARKED_READY",
            "current_zone_id": data.get("current_zone_id"),
            "current_slot": data.get("current_slot")
        }
        self._fleet_registry[vid] = vehicle
        return {"success": True, "vehicle": vehicle}

    def update_telemetry(self, vehicle_id: str, soc: int, odo: int, status: str) -> Dict[str, Any]:
        if vehicle_id not in self._fleet_registry:
            return {"success": False, "message": "Fleet vehicle not found"}
        
        veh = self._fleet_registry[vehicle_id]
        veh["battery_soc_percent"] = max(0, min(100, soc))
        veh["odometer_km"] = max(veh["odometer_km"], odo)
        veh["status"] = status
        veh["last_telemetry_sync"] = datetime.now().isoformat()
        return {"success": True, "vehicle": veh}

fleet_service = FleetTelemetryService()
