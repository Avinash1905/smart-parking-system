"""
SmartPark Corporate ESG Carbon Offset & Scope 1/2/3 Emissions Accounting Engine
Computes avoided tailpipe CO2 kilograms (kg), renewable solar EV charging offsets, and carbon credit equivalents.
"""

from typing import Dict, Any, List
from datetime import datetime

class CarbonOffsetCalculator:
    # Industry benchmark emission factors
    ICE_VEHICLE_CO2_GRAMS_PER_KM = 142.0  # Average passenger car emissions
    EV_GRID_CO2_GRAMS_PER_KWH = 580.0     # Central grid baseline intensity
    SOLAR_OFFSET_CO2_GRAMS_PER_KWH = 580.0 # Clean solar offset

    @staticmethod
    def calculate_trip_savings(
        distance_km: float,
        is_ev: bool,
        charged_kwh: float = 0.0,
        solar_fraction: float = 0.45
    ) -> Dict[str, Any]:
        """Calculates tailpipe CO2 avoided and corporate ESG green points earned."""
        if not is_ev:
            ice_emissions_kg = round((distance_km * CarbonOffsetCalculator.ICE_VEHICLE_CO2_GRAMS_PER_KM) / 1000.0, 3)
            return {
                "is_ev": False,
                "gross_trip_emissions_kg": ice_emissions_kg,
                "net_co2_savings_kg": 0.0,
                "green_credits_earned": 0,
                "esg_tier": "CONVENTIONAL_MOBILITY"
            }

        # EV Emission Savings
        avoided_tailpipe_kg = round((distance_km * CarbonOffsetCalculator.ICE_VEHICLE_CO2_GRAMS_PER_KM) / 1000.0, 3)
        solar_charged_kwh = charged_kwh * solar_fraction
        clean_solar_savings_kg = round((solar_charged_kwh * CarbonOffsetCalculator.SOLAR_OFFSET_CO2_GRAMS_PER_KWH) / 1000.0, 3)
        net_savings_kg = round(avoided_tailpipe_kg + clean_solar_savings_kg, 3)
        
        # 1 Green Point per 0.5 kg CO2 avoided
        green_points = int(round(net_savings_kg * 2.0))

        return {
            "is_ev": True,
            "avoided_tailpipe_co2_kg": avoided_tailpipe_kg,
            "solar_charging_offset_kg": clean_solar_savings_kg,
            "net_co2_savings_kg": net_savings_kg,
            "trees_equivalent": round(net_savings_kg / 21.77, 2),  # 1 mature tree absorbs ~21.77 kg CO2/year
            "green_credits_earned": max(1, green_points),
            "esg_tier": "ZERO_EMISSION_CHAMPION"
        }
