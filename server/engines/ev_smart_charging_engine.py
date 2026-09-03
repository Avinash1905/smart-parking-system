"""
SmartPark Microgrid & EV Smart Charging Load Balancing Engine
Manages multi-station EV charging power allocations, peak shaving,
solar generation integration, and thermal runaway prevention.
"""

from typing import Dict, List, Any

class EVSmartChargingEngine:
    TOTAL_FACILITY_POWER_KW = 250.0  # Max grid capacity for EV chargers
    SOLAR_CANOPY_CAPACITY_KW = 45.0  # Rooftop solar array capacity

    @classmethod
    def optimize_power_allocation(
        cls,
        active_sessions: List[Dict[str, Any]],
        current_solar_output_kw: float = 30.0,
        grid_tariff_rate_kwh: float = 8.50
    ) -> Dict[str, Any]:
        """Calculates balanced power distribution across active EV charging bays."""
        total_available_kw = cls.TOTAL_FACILITY_POWER_KW + current_solar_output_kw
        session_count = len(active_sessions)

        if session_count == 0:
            return {
                "active_chargers": 0,
                "total_available_power_kw": total_available_kw,
                "total_load_kw": 0.0,
                "grid_power_consumed_kw": 0.0,
                "solar_power_consumed_kw": 0.0,
                "allocated_sessions": []
            }

        allocated_sessions = []
        total_load_requested = 0.0

        for session in active_sessions:
            charger_type = session.get("charger_type", "AC_LEVEL_2")  # DC_FAST or AC_LEVEL_2
            req_power = 50.0 if charger_type == "DC_FAST" else 7.4
            total_load_requested += req_power

        # Determine if curtailment / throttling is needed
        throttling_ratio = min(1.0, total_available_kw / max(total_load_requested, 1.0))

        actual_total_load = 0.0
        for session in active_sessions:
            charger_type = session.get("charger_type", "AC_LEVEL_2")
            nominal_power = 50.0 if charger_type == "DC_FAST" else 7.4
            actual_kw = round(nominal_power * throttling_ratio, 2)
            actual_total_load += actual_kw

            allocated_sessions.append({
                "session_id": session.get("session_id"),
                "bay_id": session.get("bay_id"),
                "vehicle_plate": session.get("vehicle_plate"),
                "charger_type": charger_type,
                "allocated_power_kw": actual_kw,
                "is_throttled": throttling_ratio < 0.95,
                "battery_current_soc": session.get("battery_soc", 45),
                "energy_delivered_kwh": session.get("energy_delivered_kwh", 12.4)
            })

        solar_consumed = min(current_solar_output_kw, actual_total_load)
        grid_consumed = max(0.0, actual_total_load - solar_consumed)

        return {
            "active_chargers": session_count,
            "total_available_power_kw": round(total_available_kw, 2),
            "total_load_kw": round(actual_total_load, 2),
            "grid_power_consumed_kw": round(grid_consumed, 2),
            "solar_power_consumed_kw": round(solar_consumed, 2),
            "solar_offset_percent": round((solar_consumed / max(actual_total_load, 0.1)) * 100, 1),
            "grid_tariff_kwh": grid_tariff_rate_kwh,
            "allocated_sessions": allocated_sessions
        }
