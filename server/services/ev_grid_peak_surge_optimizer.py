"""
SmartPark EV Charging Demand Surge & Microgrid Shaving Optimizer Service
Schedules vehicle charging rates based on transformer oil temperature rise and municipal peak surge.
"""

from typing import Dict, List, Any
from datetime import datetime

class EVGridPeakSurgeOptimizer:
    @staticmethod
    def calculate_throttle_profile(
        substation_kw: float = 210.0,
        max_substation_kw: float = 250.0,
        transformer_temp_c: float = 64.0
    ) -> Dict[str, Any]:
        load_pct = (substation_kw / max_substation_kw) * 100.0

        if transformer_temp_c > 75.0 or load_pct > 92.0:
            throttle_factor = 0.50
            status = "THERMAL_THROTTLING_ACTIVE"
        elif load_pct > 80.0:
            throttle_factor = 0.75
            status = "MODERATE_PEAK_SHAVING"
        else:
            throttle_factor = 1.00
            status = "FULL_THROUGHPUT_NOMINAL"

        return {
            "timestamp": datetime.now().isoformat(),
            "current_load_kw": substation_kw,
            "max_capacity_kw": max_substation_kw,
            "load_percentage": round(load_pct, 1),
            "transformer_oil_temp_c": transformer_temp_c,
            "throttle_factor": throttle_factor,
            "optimizer_status": status
        }
