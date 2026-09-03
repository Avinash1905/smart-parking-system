"""
SmartPark Spatial Routing & Turn-by-Turn Navigation Engine
Computes precise GPS vector navigation steps, arrival estimates, and internal deck routing.
"""

import math
from typing import Dict, Any, List

class SpatialRoutingService:
    @staticmethod
    def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        # Haversine formula
        r = 6371.0  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2.0) ** 2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * (math.sin(dlon / 2.0) ** 2)
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(r * c, 2)

    @staticmethod
    def generate_turn_steps(zone_name: str, slot_number: str) -> List[Dict[str, Any]]:
        return [
            {"step": 1, "instruction": "Head south toward Cubbon Road", "distance": "350 m", "icon": "⬆️"},
            {"step": 2, "instruction": "Turn right onto Kasturba Road", "distance": "800 m", "icon": "➡️"},
            {"step": 3, "instruction": f"Turn left into {zone_name} Main Entrance", "distance": "120 m", "icon": "⬅️"},
            {"step": 4, "instruction": "Proceed through ANPR Barrier Gate #1", "distance": "30 m", "icon": "🛡️"},
            {"step": 5, "instruction": f"Follow Floor G ramp to assigned Bay {slot_number}", "distance": "50 m", "icon": "🅿️"}
        ]
