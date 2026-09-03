"""
SmartPark Pricing Engine REST Controller
Exposes dynamic tariff estimation, special event surges, and rate quotes.
"""

from typing import Dict, Any
from server.engines.dynamic_pricing_engine import DynamicPricingEngine
from server.database.db import db

class PricingController:
    @staticmethod
    def get_quote(params: Dict[str, Any]) -> Dict[str, Any]:
        zone_id = params.get("zone_id", "zone-pub-01")
        vehicle_type = params.get("vehicle_type", "SEDAN")
        duration_hours = float(params.get("duration_hours", 1.0))
        is_ev_charging = str(params.get("is_ev", "false")).lower() == "true"

        # Fetch base rate & occupancy from DB
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT price_per_hour, total_spaces, available_spaces FROM parking_zones WHERE id = ?", (zone_id,))
            row = cursor.fetchone()
            if not row:
                base_rate = 20.0
                occ_pct = 50.0
            else:
                base_rate = float(row["price_per_hour"])
                total = max(1, row["total_spaces"])
                avail = row["available_spaces"]
                occ_pct = round(((total - avail) / total) * 100, 1)

        quote = DynamicPricingEngine.calculate_rate(
            base_hourly_rate=base_rate,
            occupancy_percentage=occ_pct,
            vehicle_type=vehicle_type,
            is_ev_charging=is_ev_charging,
            duration_hours=duration_hours
        )

        return {"success": True, "zone_id": zone_id, "quote": quote}
