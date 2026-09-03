"""
SmartPark Dynamic Pricing & Tariff Calculation Engine
Calculates real-time parking tariffs based on occupancy thresholds, EV green subsidies,
duration tiers, and corporate employee partner agreements.
"""

from typing import Dict, Any, Optional

class PricingTariffEngine:
    SURGE_MULTIPLIERS = [
        (90.0, 1.30, "High Demand Surge (+30%)"),
        (75.0, 1.15, "Moderate Demand (+15%)"),
        (0.0, 1.00, "Standard Rate")
    ]

    @classmethod
    def calculate_fare(
        cls,
        base_rate_per_hour: float,
        duration_hours: float,
        occupancy_percent: float,
        is_ev: bool = False,
        is_corporate_partner: bool = False,
        is_weekend: bool = False
    ) -> Dict[str, Any]:
        duration_hours = max(0.5, float(duration_hours))
        
        # 1. Base amount
        subtotal = base_rate_per_hour * duration_hours

        # 2. Demand Surge Adjustment
        surge_multiplier = 1.0
        surge_label = "Standard"
        for threshold, mult, label in cls.SURGE_MULTIPLIERS:
            if occupancy_percent >= threshold:
                surge_multiplier = mult
                surge_label = label
                break

        demand_adjusted = subtotal * surge_multiplier

        # 3. EV Green Incentive (15% off base tariff)
        ev_discount = (demand_adjusted * 0.15) if is_ev else 0.0

        # 4. Corporate Subsidized Rate (30% employer coverage)
        corp_subsidy = (demand_adjusted * 0.30) if is_corporate_partner else 0.0

        # 5. Long-Stay Tier (duration > 4 hours gets 10% volume discount)
        long_stay_discount = (demand_adjusted * 0.10) if duration_hours >= 4.0 else 0.0

        # 6. Final Calculation
        total_discount = ev_discount + corp_subsidy + long_stay_discount
        final_fare = max(10.0, round(demand_adjusted - total_discount, 2))
        
        # GST Tax Breakdown (18%)
        tax_amount = round(final_fare * 0.18, 2)
        total_billed = round(final_fare + tax_amount, 2)

        return {
            "base_rate_per_hour": base_rate_per_hour,
            "duration_hours": duration_hours,
            "occupancy_percent": occupancy_percent,
            "surge_multiplier": surge_multiplier,
            "surge_label": surge_label,
            "subtotal": round(subtotal, 2),
            "ev_discount": round(ev_discount, 2),
            "corporate_subsidy": round(corp_subsidy, 2),
            "long_stay_discount": round(long_stay_discount, 2),
            "net_fare": final_fare,
            "gst_tax_18_pct": tax_amount,
            "total_billed_inr": total_billed
        }
