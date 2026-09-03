"""
SmartPark EV Charging Stations REST Controller
Manages charging sessions, realtime kW load, and smart power allocations.
"""

from typing import Dict, Any, List
from server.engines.ev_smart_charging_engine import EVSmartChargingEngine
import uuid

# Sample active charging sessions
_ACTIVE_CHARGERS = [
    {"session_id": "evs-001", "bay_id": "slot-pub-01-01", "vehicle_plate": "KA-01-EV-1008", "charger_type": "DC_FAST", "battery_soc": 68, "energy_delivered_kwh": 24.5},
    {"session_id": "evs-002", "bay_id": "slot-pub-01-02", "vehicle_plate": "MH-02-EE-9002", "charger_type": "AC_LEVEL_2", "battery_soc": 42, "energy_delivered_kwh": 8.1}
]

class EVChargingController:
    @staticmethod
    def get_status() -> Dict[str, Any]:
        result = EVSmartChargingEngine.optimize_power_allocation(_ACTIVE_CHARGERS)
        return {"success": True, "data": result}

    @staticmethod
    def start_session(bay_id: str, vehicle_plate: str, charger_type: str = "AC_LEVEL_2") -> Dict[str, Any]:
        session_id = f"evs-{uuid.uuid4().hex[:6]}"
        new_session = {
            "session_id": session_id,
            "bay_id": bay_id,
            "vehicle_plate": vehicle_plate.upper(),
            "charger_type": charger_type,
            "battery_soc": 20,
            "energy_delivered_kwh": 0.0
        }
        _ACTIVE_CHARGERS.append(new_session)
        return {"success": True, "message": "Charging session initialized", "session": new_session}
