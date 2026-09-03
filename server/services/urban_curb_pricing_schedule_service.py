"""
SmartPark Urban Curb Space Congestion Pricing & Time-Varying Tariff Service
Calculates hourly price schedules for high-demand municipal street curbs,
encouraging turnover for freight delivery and preventing double-parking congestion.
"""

from typing import Dict, List, Any
from datetime import datetime

class UrbanCurbPricingScheduleService:
    @staticmethod
    def get_hourly_rate_schedule(curb_id: str = "CURB-MG-01") -> Dict[str, Any]:
        now = datetime.now()
        current_hour = now.hour

        # Commercial peak delivery hours: 08:00 - 12:00
        if 8 <= current_hour < 12:
            rate_inr_per_hr = 40.0
            pricing_tier = "PEAK_COMMERCIAL_DELIVERY"
            max_dwell_mins = 20
        elif 12 <= current_hour < 17:
            rate_inr_per_hr = 25.0
            pricing_tier = "AFTERNOON_RETAIL_SHORT_STAY"
            max_dwell_mins = 45
        elif 17 <= current_hour < 22:
            rate_inr_per_hr = 35.0
            pricing_tier = "EVENING_DINING_RIDESHARE"
            max_dwell_mins = 60
        else:
            rate_inr_per_hr = 10.0
            pricing_tier = "OVERNIGHT_RESIDENT_OVERFLOW"
            max_dwell_mins = 480

        return {
            "curb_id": curb_id,
            "timestamp": now.isoformat(),
            "current_hour": current_hour,
            "hourly_rate_inr": rate_inr_per_hr,
            "pricing_tier": pricing_tier,
            "max_allowed_dwell_minutes": max_dwell_mins,
            "overstay_penalty_per_minute_inr": 15.0
        }
