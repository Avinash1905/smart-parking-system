"""
SmartPark Vehicle-to-Grid (V2G) Bi-Directional Power Dispatch Service
Discharges energy from plugged-in employee EVs back into the building microgrid
during peak grid tariff hours while preserving guaranteed driver departure range.
"""

from typing import Dict, List, Any
from datetime import datetime

class EVBiDirectionalV2GService:
    @staticmethod
    def calculate_v2g_export(
        battery_current_soc: int = 85,
        battery_pack_capacity_kwh: float = 60.0,
        min_driver_reserve_soc: int = 50,
        grid_peak_export_price_inr: float = 14.50
    ) -> Dict[str, Any]:
        """Calculates available kWh export and revenue earned by the vehicle owner."""
        available_discharge_soc = max(0, battery_current_soc - min_driver_reserve_soc)
        available_kwh = round((available_discharge_soc / 100.0) * battery_pack_capacity_kwh, 2)
        gross_payout_inr = round(available_kwh * grid_peak_export_price_inr, 2)
        driver_net_earnings_inr = round(gross_payout_inr * 0.80, 2)  # 80% to driver, 20% platform fee

        return {
            "timestamp": datetime.now().isoformat(),
            "battery_current_soc_pct": battery_current_soc,
            "min_guaranteed_departure_soc_pct": min_driver_reserve_soc,
            "dischargeable_soc_pct": available_discharge_soc,
            "available_export_energy_kwh": available_kwh,
            "grid_feed_in_tariff_per_kwh": grid_peak_export_price_inr,
            "driver_net_payout_inr": driver_net_earnings_inr,
            "facility_grid_offset_kw": 22.0,
            "inverter_mode": "BIDIRECTIONAL_DISCHARGING" if available_kwh > 0 else "HOLD_MIN_RESERVE"
        }
