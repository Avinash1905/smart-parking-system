"""
SmartPark Advanced Multi-Attribute Spatial Search Engine
Provides geo-distance proximity calculations, multi-criteria filtering, price ceiling enforcement, EV availability sorting, and real-time bay matching.
"""

import math
from typing import Dict, List, Any, Optional
from datetime import datetime

class ParkingSearchCriteria:
    def __init__(
        self,
        latitude: float = 12.9716,
        longitude: float = 77.5946,
        max_distance_km: float = 15.0,
        max_price_per_hour: Optional[float] = None,
        category: Optional[str] = None,
        require_ev_charging: bool = False,
        require_covered_roof: bool = False,
        require_security_guard: bool = False,
        require_anpr: bool = False,
        require_open_now: bool = False,
        min_available_spaces: int = 1,
        vehicle_type: str = "CAR",
        company_id: Optional[str] = None,
        sort_by: str = "RECOMMENDED",
        limit: int = 20,
        offset: int = 0
    ):
        self.latitude = latitude
        self.longitude = longitude
        self.max_distance_km = max_distance_km
        self.max_price_per_hour = max_price_per_hour
        self.category = category
        self.require_ev_charging = require_ev_charging
        self.require_covered_roof = require_covered_roof
        self.require_security_guard = require_security_guard
        self.require_anpr = require_anpr
        self.require_open_now = require_open_now
        self.min_available_spaces = min_available_spaces
        self.vehicle_type = vehicle_type
        self.company_id = company_id
        self.sort_by = sort_by
        self.limit = limit
        self.offset = offset

class SpatialSearchEngine:
    @staticmethod
    def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates precise great-circle distance between two GPS coordinates using Haversine formula."""
        r = 6371.0  # Earth radius in kilometers
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        a = (math.sin(d_lat / 2.0) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(d_lon / 2.0) ** 2)
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(r * c, 2)

    @staticmethod
    def estimate_walking_minutes(distance_km: float, speed_kmh: float = 4.8) -> int:
        """Estimates pedestrian walking time in minutes based on 4.8 km/h average walking speed."""
        hours = distance_km / speed_kmh
        return max(1, int(round(hours * 60)))

    @staticmethod
    def filter_and_rank_zones(zones: List[Dict[str, Any]], criteria: ParkingSearchCriteria) -> Dict[str, Any]:
        """Filters parking zones by criteria and sorts by the requested ranking algorithm."""
        filtered_results = []
        
        for zone in zones:
            # 1. Proximity Calculation
            zone_lat = float(zone.get("latitude", criteria.latitude))
            zone_lon = float(zone.get("longitude", criteria.longitude))
            dist_km = SpatialSearchEngine.haversine_distance_km(criteria.latitude, criteria.longitude, zone_lat, zone_lon)
            
            if dist_km > criteria.max_distance_km:
                continue

            # 2. Price Filter
            hourly_rate = float(zone.get("price_per_hour", 0.0))
            if criteria.max_price_per_hour is not None and hourly_rate > criteria.max_price_per_hour:
                continue

            # 3. Category Filter
            zone_cat = zone.get("category", "PUBLIC")
            if criteria.category and criteria.category != "ALL" and zone_cat != criteria.category:
                continue

            # 4. EV Spaces Filter
            ev_count = int(zone.get("ev_spaces", 0))
            if criteria.require_ev_charging and ev_count <= 0:
                continue

            # 5. Amenity Filters
            if criteria.require_covered_roof and not bool(zone.get("covered_roof", 0)):
                continue
            if criteria.require_security_guard and not bool(zone.get("security_guard_on_site", 0)):
                continue
            if criteria.require_anpr and not bool(zone.get("anpr_camera_installed", 0)):
                continue

            # 6. Availability Check
            available_spaces = int(zone.get("available_spaces", 0))
            if available_spaces < criteria.min_available_spaces:
                continue

            # 7. Corporate Access Check
            if zone_cat == "PRIVATE_COMPANY" and criteria.company_id:
                allowed_comps = zone.get("allowed_companies", [])
                if isinstance(allowed_comps, str):
                    import json
                    allowed_comps = json.loads(allowed_comps or "[]")
                comp_match = criteria.company_id in allowed_comps or criteria.company_id == zone.get("company_id")
                if not comp_match:
                    continue

            # Enrich zone with dynamic spatial metrics
            walking_min = SpatialSearchEngine.estimate_walking_minutes(dist_km)
            total_spaces = max(1, int(zone.get("total_spaces", 100)))
            occupancy_pct = round(((total_spaces - available_spaces) / total_spaces) * 100.0, 1)

            # Calculate composite ranking score
            # Higher score = Better match
            availability_factor = (available_spaces / total_spaces) * 40.0
            distance_factor = max(0.0, (1.0 - (dist_km / criteria.max_distance_km))) * 35.0
            price_factor = max(0.0, (1.0 - (hourly_rate / 100.0))) * 25.0
            composite_score = round(availability_factor + distance_factor + price_factor, 1)

            enriched_zone = dict(zone)
            enriched_zone["computed_distance_km"] = dist_km
            enriched_zone["computed_walking_minutes"] = walking_min
            enriched_zone["computed_occupancy_percent"] = occupancy_pct
            enriched_zone["search_match_score"] = composite_score

            filtered_results.append(enriched_zone)

        # Apply Sorting Algorithm
        if criteria.sort_by == "DISTANCE":
            filtered_results.sort(key=lambda x: x["computed_distance_km"])
        elif criteria.sort_by == "PRICE_LOW_TO_HIGH":
            filtered_results.sort(key=lambda x: float(x.get("price_per_hour", 0.0)))
        elif criteria.sort_by == "PRICE_HIGH_TO_LOW":
            filtered_results.sort(key=lambda x: float(x.get("price_per_hour", 0.0)), reverse=True)
        elif criteria.sort_by == "AVAILABILITY":
            filtered_results.sort(key=lambda x: int(x.get("available_spaces", 0)), reverse=True)
        elif criteria.sort_by == "RATING":
            filtered_results.sort(key=lambda x: float(x.get("rating", 0.0)), reverse=True)
        else:  # RECOMMENDED
            filtered_results.sort(key=lambda x: x["search_match_score"], reverse=True)

        total_count = len(filtered_results)
        paginated_results = filtered_results[criteria.offset : criteria.offset + criteria.limit]

        return {
            "total_matches": total_count,
            "returned_count": len(paginated_results),
            "limit": criteria.limit,
            "offset": criteria.offset,
            "results": paginated_results
        }
