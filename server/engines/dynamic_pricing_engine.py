"""
SmartPark Advanced Dynamic Pricing Engine
Computes real-time tariffs based on occupancy pressure, time-of-day multipliers,
vehicle classifications, EV charging fees, and event surcharges.
"""

from datetime import datetime
from typing import Dict, Any, List, Optional

class DynamicPricingEngine:
    # Base tariff matrix by vehicle classification
    VEHICLE_MULTIPLIERS = {
        "MOTORCYCLE": 0.50,
        "COMPACT": 0.90,
        "SEDAN": 1.00,
        "SUV": 1.25,
        "EV": 1.10,          # Includes base AC level-2 power standby
        "TRUCK": 1.75,
        "BUS": 2.20
    }

    PEAK_HOURS = [
        (8.5, 11.5, 1.35),   # Morning Commute Peak (35% surge)
        (12.0, 14.0, 1.15),  # Lunch Rush (15% surge)
        (17.0, 20.0, 1.45),  # Evening Commute Peak (45% surge)
        (23.0, 6.0, 0.70)    # Overnight Economy Discount (30% off)
    ]

    @classmethod
    def calculate_rate(
        cls,
        base_hourly_rate: float,
        occupancy_percentage: float,
        vehicle_type: str = "SEDAN",
        is_ev_charging: bool = False,
        is_special_event: bool = False,
        user_loyalty_tier: str = "STANDARD",
        duration_hours: float = 1.0
    ) -> Dict[str, Any]:
        """Calculates itemized dynamic parking fee breakdown."""
        
        # 1. Occupancy Pressure Multiplier
        if occupancy_percentage >= 95.0:
            occ_multiplier = 1.60
            demand_status = "CRITICAL_HIGH"
        elif occupancy_percentage >= 85.0:
            occ_multiplier = 1.35
            demand_status = "HIGH"
        elif occupancy_percentage >= 65.0:
            occ_multiplier = 1.10
            demand_status = "MODERATE"
        elif occupancy_percentage <= 30.0:
            occ_multiplier = 0.85
            demand_status = "LOW_SURPLUS"
        else:
            occ_multiplier = 1.00
            demand_status = "NORMAL"

        # 2. Time-of-Day Multiplier
        now = datetime.now()
        current_time_float = now.hour + (now.minute / 60.0)
        time_multiplier = 1.0
        time_period_label = "STANDARD_HOURS"

        for start, end, mult in cls.PEAK_HOURS:
            if start <= end:
                if start <= current_time_float < end:
                    time_multiplier = mult
                    time_period_label = "PEAK_RUSH" if mult > 1.0 else "NIGHT_ECONOMY"
                    break
            else:  # Wraps around midnight (23:00 to 06:00)
                if current_time_float >= start or current_time_float < end:
                    time_multiplier = mult
                    time_period_label = "NIGHT_ECONOMY"
                    break

        # 3. Vehicle Type Multiplier
        v_mult = cls.VEHICLE_MULTIPLIERS.get(vehicle_type.upper(), 1.0)

        # 4. Special Event Multiplier
        event_multiplier = 1.50 if is_special_event else 1.00

        # 5. Effective Base Rate
        effective_hourly = round(base_hourly_rate * occ_multiplier * time_multiplier * v_mult * event_multiplier, 2)

        # 6. EV Energy Consumption Fee
        ev_energy_rate = 12.50 if is_ev_charging else 0.00
        ev_estimated_kwh = (7.4 * duration_hours) if is_ev_charging else 0.00
        ev_total_fee = round(ev_estimated_kwh * 2.50, 2) if is_ev_charging else 0.00

        # 7. Base Subtotal
        parking_subtotal = round(effective_hourly * duration_hours, 2)

        # 8. Loyalty Tier Discount
        loyalty_discount_pct = 0.0
        if user_loyalty_tier.upper() == "VIP":
            loyalty_discount_pct = 0.20
        elif user_loyalty_tier.upper() == "GOLD":
            loyalty_discount_pct = 0.15
        elif user_loyalty_tier.upper() == "SILVER":
            loyalty_discount_pct = 0.10

        discount_amount = round(parking_subtotal * loyalty_discount_pct, 2)

        # 9. Municipal Smart City Surcharge / Taxes (5%)
        tax_amount = round((parking_subtotal - discount_amount + ev_total_fee) * 0.05, 2)

        # 10. Final Total
        grand_total = round(parking_subtotal - discount_amount + ev_total_fee + tax_amount, 2)

        return {
            "base_hourly_rate": base_hourly_rate,
            "effective_hourly_rate": effective_hourly,
            "duration_hours": duration_hours,
            "demand_status": demand_status,
            "time_period_label": time_period_label,
            "multipliers": {
                "occupancy": occ_multiplier,
                "time_of_day": time_multiplier,
                "vehicle_type": v_mult,
                "special_event": event_multiplier
            },
            "breakdown": {
                "parking_subtotal": parking_subtotal,
                "loyalty_tier": user_loyalty_tier.upper(),
                "discount_amount": discount_amount,
                "ev_charging_fee": ev_total_fee,
                "ev_estimated_kwh": round(ev_estimated_kwh, 2),
                "taxes_and_fees": tax_amount
            },
            "grand_total": grand_total,
            "currency": "INR"
        }
