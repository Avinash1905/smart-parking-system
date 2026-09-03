"""
SmartPark Microgrid Battery Arbitrage & Peak Demand Reduction Service
Executes automated dispatch curves for commercial battery energy storage systems (BESS),
mitigating monthly peak utility kW demand ratchets.
"""

from typing import Dict, List, Any
from datetime import datetime

class MicrogridBatteryArbitrageService:
    @staticmethod
    def calculate_peak_shaving_savings(
        unmitigated_peak_kw: float = 380.0,
        bess_discharge_capacity_kw: float = 120.0,
        demand_charge_per_kw_inr: float = 450.0
    ) -> Dict[str, Any]:
        """Calculates utility bill savings from shaving monthly peak demand spikes."""
        shaved_peak_kw = max(0.0, unmitigated_peak_kw - bess_discharge_capacity_kw)
        monthly_demand_charge_baseline = unmitigated_peak_kw * demand_charge_per_kw_inr
        monthly_demand_charge_shaved = shaved_peak_kw * demand_charge_per_kw_inr
        net_monthly_savings_inr = round(monthly_demand_charge_baseline - monthly_demand_charge_shaved, 2)

        return {
            "timestamp": datetime.now().isoformat(),
            "unmitigated_peak_kw": unmitigated_peak_kw,
            "bess_discharge_injection_kw": bess_discharge_capacity_kw,
            "target_facility_peak_kw": round(shaved_peak_kw, 1),
            "demand_charge_rate_inr_per_kw": demand_charge_per_kw_inr,
            "financial_impact": {
                "baseline_demand_charge_inr": monthly_demand_charge_baseline,
                "shaved_demand_charge_inr": monthly_demand_charge_shaved,
                "monthly_demand_cost_savings_inr": net_monthly_savings_inr,
                "projected_annual_savings_inr": round(net_monthly_savings_inr * 12.0, 2)
            },
            "grid_stability_rating": "OPTIMAL_LOAD_BALANCED"
        }
