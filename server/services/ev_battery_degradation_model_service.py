"""
SmartPark EV Battery Degradation & High-C-Rate Fast Charge Longevity Model Service
Models lithium-ion battery capacity fade over time as a function of DC fast charging cycles,
temperature exposure, and average state-of-charge dwell times.
"""

from typing import Dict, List, Any
import math
from datetime import datetime

class EVBatteryDegradationModelService:
    @staticmethod
    def model_battery_fade(
        total_fast_charge_cycles: int = 140,
        total_ac_slow_cycles: int = 420,
        avg_battery_temp_c: float = 28.5,
        nominal_pack_capacity_kwh: float = 60.0
    ) -> Dict[str, Any]:
        # Cycle aging factor (DC fast charging causes ~1.4x the SEI layer growth of slow AC)
        equivalent_full_cycles = (total_fast_charge_cycles * 1.4) + total_ac_slow_cycles
        
        # Arrhenius thermal degradation factor
        thermal_stress = math.exp((avg_battery_temp_c - 25.0) / 18.0)
        capacity_loss_pct = round(0.0045 * math.sqrt(equivalent_full_cycles) * thermal_stress, 2)
        remaining_soh_pct = max(70.0, round(100.0 - capacity_loss_pct, 2))
        current_capacity_kwh = round((remaining_soh_pct / 100.0) * nominal_pack_capacity_kwh, 2)

        return {
            "timestamp": datetime.now().isoformat(),
            "total_dc_fast_cycles": total_fast_charge_cycles,
            "total_ac_slow_cycles": total_ac_slow_cycles,
            "equivalent_stress_cycles": round(equivalent_full_cycles, 1),
            "estimated_capacity_loss_pct": capacity_loss_pct,
            "current_battery_soh_pct": remaining_soh_pct,
            "current_usable_capacity_kwh": current_capacity_kwh,
            "battery_health_grade": "EXCELLENT" if remaining_soh_pct >= 90.0 else ("GOOD" if remaining_soh_pct >= 80.0 else "FAIR"),
            "warranty_claim_eligible": remaining_soh_pct < 70.0
        }
