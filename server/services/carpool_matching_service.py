"""
SmartPark Corporate Carpooling Matcher & Commute Optimization Service
Pairs employees with overlapping travel corridors to reduce parking demand,
awards green commuter credits, and allocates dedicated carpooling prime bays.
"""

from typing import Dict, List, Any, Optional
import math
import uuid
from datetime import datetime

class CarpoolMatchingService:
    @staticmethod
    def calculate_commute_overlap(
        origin_lat1: float, origin_lng1: float,
        origin_lat2: float, origin_lng2: float,
        dest_lat: float = 12.9716, dest_lng: float = 77.5946
    ) -> float:
        """Calculates route compatibility score (0.0 to 1.0) using Haversine distance."""
        d_origins = math.sqrt((origin_lat1 - origin_lat2)**2 + (origin_lng1 - origin_lng2)**2) * 111.0
        # If pickup is within 3 km, very high match
        if d_origins <= 1.5:
            return 0.95
        elif d_origins <= 3.5:
            return 0.80
        elif d_origins <= 6.0:
            return 0.60
        return 0.30

    @classmethod
    def find_matches(
        cls,
        user_id: str,
        company_id: str,
        home_latitude: float,
        home_longitude: float,
        arrival_time: str = "09:00"
    ) -> Dict[str, Any]:
        """Finds eligible corporate colleagues travelling to the same campus."""
        sample_riders = [
            {
                "employee_id": "EMP-4102",
                "name": "Pooja Hegde",
                "department": "Engineering",
                "home_suburb": "Indiranagar",
                "home_lat": 12.9784,
                "home_lng": 77.6408,
                "preferred_time": "08:50",
                "carpool_role": "RIDER",
                "trust_score": 4.9
            },
            {
                "employee_id": "EMP-8821",
                "name": "Arjun Reddy",
                "department": "Product",
                "home_suburb": "Koramangala",
                "home_lat": 12.9352,
                "home_lng": 77.6245,
                "preferred_time": "09:05",
                "carpool_role": "DRIVER",
                "vehicle_model": "MG ZS EV",
                "seats_available": 3,
                "trust_score": 5.0
            }
        ]

        scored_matches = []
        for rider in sample_riders:
            overlap = cls.calculate_commute_overlap(home_latitude, home_longitude, rider["home_lat"], rider["home_lng"])
            scored_matches.append({
                **rider,
                "compatibility_score": round(overlap * 100, 1),
                "detour_time_mins": max(2, round((1.0 - overlap) * 12)),
                "allocated_carpool_bay": "BAY-CARPOOL-01"
            })

        scored_matches.sort(key=lambda x: x["compatibility_score"], reverse=True)

        return {
            "user_id": user_id,
            "company_id": company_id,
            "timestamp": datetime.now().isoformat(),
            "matches": scored_matches,
            "carpool_incentives": {
                "parking_rebate_pct": 50.0,
                "green_points_per_trip": 40,
                "priority_elevator_bay": True
            }
        }
