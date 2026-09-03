"""
SmartPark Battery Energy Storage System (BESS) & Grid Tariff Arbitrage Service
Optimizes energy storage charging during low off-peak hours and discharges to EV bays
during peak utility tariff periods to minimize facility operating expenses.
"""

from typing import Dict, List, Any
from datetime import datetime

class EnergyTariffOptimizerService:
    BESS_BATTERY_CAPACITY_KWH = 500.0  # 500 kWh stationary lithium iron phosphate pack
    
    @classmethod
    def get_energy_dispatch_plan(cls, current_bess_soc_pct: float = 85.0) -> Dict[str, Any]:
        now = datetime.now()
        hour = now.hour + (now.minute / 60.0)

        # Determine current utility tariff tier
        if 6.0 <= hour < 10.0 or 17.0 <= hour < 22.0:
            grid_status = "PEAK_DEMAND"
            grid_price_kwh = 11.50
            bess_action = "DISCHARGING_TO_EV_LOAD"
            bess_discharge_rate_kw = 75.0
            solar_injection_kw = 42.0
        elif 23.0 <= hour or hour < 6.0:
            grid_status = "OFF_PEAK_SURPLUS"
            grid_price_kwh = 4.20
            bess_action = "CHARGING_FROM_GRID"
            bess_discharge_rate_kw = -50.0  # Negative represents charging
            solar_injection_kw = 0.0
        else:
            grid_status = "STANDARD_MID_PEAK"
            grid_price_kwh = 7.80
            bess_action = "SOLAR_SELF_CONSUMPTION"
            bess_discharge_rate_kw = 20.0
            solar_injection_kw = 35.0

        daily_arbitrage_savings_inr = 3450.0

        return {
            "timestamp": now.isoformat(),
            "grid_status": grid_status,
            "current_grid_price_per_kwh": grid_price_kwh,
            "bess_soc_percentage": current_bess_soc_pct,
            "bess_stored_energy_kwh": round((current_bess_soc_pct / 100.0) * cls.BESS_BATTERY_CAPACITY_KWH, 1),
            "bess_mode": bess_action,
            "bess_power_flow_kw": bess_discharge_rate_kw,
            "solar_generation_kw": solar_injection_kw,
            "estimated_daily_savings_inr": daily_arbitrage_savings_inr,
            "facility_carbon_intensity_gco2_kwh": 380 if bess_action == "DISCHARGING_TO_EV_LOAD" else 620
        }
