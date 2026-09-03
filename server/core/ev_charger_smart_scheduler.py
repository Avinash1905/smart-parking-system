"""
SmartPark OCPP 2.0.1 Smart EV Charger Scheduling & Dynamic Load Shedding Engine
Manages multi-charger power balancing, dynamic kW throttle during peak building loads, and reservation priority queueing.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime

class EVChargerSmartScheduler:
    FACILITY_TOTAL_EV_POWER_BUDGET_KW = 350.0  # Max facility transformer capacity for EV charging

    @staticmethod
    def balance_charging_loads(active_sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Dynamically throttles individual charger kW output to keep total facility load below transformer limits."""
        count = len(active_sessions)
        if count == 0:
            return {
                "active_chargers_count": 0,
                "total_power_dispatched_kw": 0.0,
                "available_headroom_kw": EVChargerSmartScheduler.FACILITY_TOTAL_EV_POWER_BUDGET_KW,
                "load_shedding_status": "IDLE"
            }

        nominal_total_demand = sum(float(s.get("requested_power_kw", 50.0)) for s in active_sessions)
        
        # Determine throttle factor
        if nominal_total_demand > EVChargerSmartScheduler.FACILITY_TOTAL_EV_POWER_BUDGET_KW:
            scale_factor = EVChargerSmartScheduler.FACILITY_TOTAL_EV_POWER_BUDGET_KW / nominal_total_demand
            is_throttled = True
        else:
            scale_factor = 1.0
            is_throttled = False

        balanced_chargers = []
        for s in active_sessions:
            req_kw = float(s.get("requested_power_kw", 50.0))
            allocated_kw = round(req_kw * scale_factor, 1)
            balanced_chargers.append({
                "charger_id": s.get("charger_id", "CCS2-01"),
                "vehicle_plate": s.get("vehicle_plate", "KA-01-EQ-9988"),
                "requested_kw": req_kw,
                "allocated_kw": allocated_kw,
                "throttle_percentage": round((1.0 - scale_factor) * 100.0, 1) if is_throttled else 0.0
            })

        total_dispatched = sum(c["allocated_kw"] for c in balanced_chargers)

        return {
            "evaluation_timestamp": datetime.utcnow().isoformat(),
            "facility_budget_kw": EVChargerSmartScheduler.FACILITY_TOTAL_EV_POWER_BUDGET_KW,
            "nominal_demand_kw": nominal_total_demand,
            "total_power_dispatched_kw": round(total_dispatched, 1),
            "load_shedding_active": is_throttled,
            "balanced_chargers": balanced_chargers,
            "grid_transformer_utilization_pct": round((total_dispatched / EVChargerSmartScheduler.FACILITY_TOTAL_EV_POWER_BUDGET_KW) * 100.0, 1)
        }
