"""
SmartPark ESG Carbon Accounting & Green Credit Generation Service
Quantifies avoided tailpipe emissions from EV charging sessions, rooftop solar offsets,
and municipal smart traffic idling reductions per ISO 14064 GHG protocols.
"""

from typing import Dict, List, Any
from datetime import datetime

class GreenCarbonCreditService:
    # Carbon emission factors (kg CO2e per unit)
    ICE_EMISSIONS_PER_KM = 0.170        # Average gasoline sedan tailpipe emission
    GRID_ELECTRICITY_KG_PER_KWH = 0.720 # Central grid generation intensity
    SOLAR_OFFSET_KG_PER_KWH = 0.720     # Avoided grid emission from solar

    @classmethod
    def calculate_facility_carbon_ledger(
        cls,
        ev_charging_kwh_delivered: float = 12500.0,
        solar_generation_kwh: float = 4200.0,
        idling_hours_reduced: float = 380.0
    ) -> Dict[str, Any]:
        """Generates comprehensive ESG sustainability report metrics."""
        
        # 1. EV Tailpipe avoidance (assuming 6 km per kWh)
        ev_km_driven = ev_charging_kwh_delivered * 6.0
        avoided_ice_tailpipe_kg = ev_km_driven * cls.ICE_EMISSIONS_PER_KM

        # 2. Solar rooftop offset
        solar_offset_kg = solar_generation_kwh * cls.SOLAR_OFFSET_KG_PER_KWH

        # 3. Smart parking search time reduction (idling at ~0.8 liters/hr = 1.84 kg CO2/hr)
        idling_avoidance_kg = idling_hours_reduced * 1.84

        # Net greenhouse gas avoidance
        total_avoided_co2_kg = round(avoided_ice_tailpipe_kg + solar_offset_kg + idling_avoidance_kg, 2)
        total_avoided_co2_tonnes = round(total_avoided_co2_kg / 1000.0, 3)
        green_credits_minted = round(total_avoided_co2_tonnes, 2)

        return {
            "timestamp": datetime.now().isoformat(),
            "reporting_period": "CURRENT_MONTH_MTD",
            "ghg_accounting_standard": "ISO 14064-1 / GHG PROTOCOL",
            "metrics": {
                "ev_clean_kilometers_enabled": round(ev_km_driven, 1),
                "tailpipe_co2_avoided_kg": round(avoided_ice_tailpipe_kg, 1),
                "rooftop_solar_offset_kg": round(solar_offset_kg, 1),
                "congestion_idling_saved_kg": round(idling_avoidance_kg, 1),
                "net_avoided_co2_tonnes": total_avoided_co2_tonnes
            },
            "carbon_credits": {
                "verified_credits_minted": green_credits_minted,
                "registry": "SmartPark Municipal Green Registry",
                "trees_planted_equivalent": int(total_avoided_co2_kg / 21.7)
            }
        }
