"""
SmartPark Vehicle-to-Grid (V2G) Bi-Directional Microgrid Load Balancing Engine
Orchestrates grid peak shaving, dynamic power export compensation (₹14.50/kWh), and EV battery longevity thermal guardrails.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime

class V2GMicrogridBalancer:
    GRID_FEEDIN_RATE_INR_KWH = 14.50
    MIN_BATTERY_RESERVE_SOC_PCT = 40.0  # Never discharge user EV below 40% SoC
    MAX_DISCHARGE_POWER_KW = 22.0       # Bi-directional AC/DC onboard inverter limit

    @staticmethod
    def calculate_v2g_arbitrage(
        connected_evs: List[Dict[str, Any]],
        facility_grid_demand_kw: float,
        solar_pv_generation_kw: float
    ) -> Dict[str, Any]:
        """Calculates net facility grid deficit and schedules active EV discharge to mitigate peak grid tariffs."""
        net_grid_draw_kw = max(0.0, facility_grid_demand_kw - solar_pv_generation_kw)
        eligible_discharge_evs = []
        total_available_v2g_capacity_kwh = 0.0

        for ev in connected_evs:
            current_soc = float(ev.get("battery_soc_pct", 50.0))
            battery_cap_kwh = float(ev.get("battery_capacity_kwh", 60.0))
            is_v2g_enabled = bool(ev.get("v2g_opt_in", False))

            if is_v2g_enabled and current_soc > V2GMicrogridBalancer.MIN_BATTERY_RESERVE_SOC_PCT:
                usable_soc_delta = (current_soc - V2GMicrogridBalancer.MIN_BATTERY_RESERVE_SOC_PCT) / 100.0
                usable_kwh = round(battery_cap_kwh * usable_soc_delta, 2)
                total_available_v2g_capacity_kwh += usable_kwh

                eligible_discharge_evs.append({
                    "vehicle_plate": ev.get("vehicle_plate", "UNKNOWN"),
                    "stall_code": ev.get("stall_code", "EV-01"),
                    "current_soc_pct": current_soc,
                    "usable_v2g_energy_kwh": usable_kwh,
                    "scheduled_discharge_kw": min(V2GMicrogridBalancer.MAX_DISCHARGE_POWER_KW, usable_kwh * 2.0),
                    "estimated_driver_earning_inr": round(usable_kwh * V2GMicrogridBalancer.GRID_FEEDIN_RATE_INR_KWH, 2)
                })

        # Calculate peak shaving offset
        dispatched_v2g_kw = min(net_grid_draw_kw * 0.65, sum(e["scheduled_discharge_kw"] for e in eligible_discharge_evs))
        effective_facility_demand_kw = max(0.0, facility_grid_demand_kw - solar_pv_generation_kw - dispatched_v2g_kw)

        return {
            "evaluation_timestamp": datetime.utcnow().isoformat(),
            "facility_gross_demand_kw": facility_grid_demand_kw,
            "rooftop_solar_generation_kw": solar_pv_generation_kw,
            "net_grid_draw_before_v2g_kw": round(net_grid_draw_kw, 2),
            "dispatched_v2g_battery_kw": round(dispatched_v2g_kw, 2),
            "net_grid_draw_after_v2g_kw": round(effective_facility_demand_kw, 2),
            "grid_peak_shaving_percentage": round((dispatched_v2g_kw / max(1.0, net_grid_draw_kw)) * 100.0, 1),
            "participating_vehicles_count": len(eligible_discharge_evs),
            "participating_vehicles": eligible_discharge_evs,
            "total_driver_payout_pool_inr": sum(e["estimated_driver_earning_inr"] for e in eligible_discharge_evs),
            "microgrid_status": "PEAK_SHAVING_ACTIVE" if dispatched_v2g_kw > 0 else "GRID_NOMINAL"
        }
