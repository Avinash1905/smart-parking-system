"""
SmartPark Search & Spatial Query API Controller
Handles query parameters, geo-bounding filters, sorting requests, and returns ranked parking facility matches.
"""

import json
from urllib.parse import parse_qs, urlparse
from typing import Dict, Any
from server.services.business_services import ParkingService
from server.core.search_engine import SpatialSearchEngine, ParkingSearchCriteria

class SearchController:
    @staticmethod
    def handle_search_request(query_params: Dict[str, Any], user: Any = None) -> Dict[str, Any]:
        """Parses HTTP GET query parameters and invokes the spatial search engine."""
        try:
            lat = float(query_params.get("lat", [12.9716])[0])
            lon = float(query_params.get("lon", [77.5946])[0])
            max_dist = float(query_params.get("max_dist", [15.0])[0])
            price_ceiling = float(query_params.get("max_price", [0])[0]) if "max_price" in query_params else None
            cat = query_params.get("category", ["ALL"])[0]
            require_ev = query_params.get("ev", ["false"])[0].lower() == "true"
            require_roof = query_params.get("roof", ["false"])[0].lower() == "true"
            require_security = query_params.get("security", ["false"])[0].lower() == "true"
            require_anpr = query_params.get("anpr", ["false"])[0].lower() == "true"
            sort_by = query_params.get("sort", ["RECOMMENDED"])[0]
            limit = int(query_params.get("limit", [20])[0])
            offset = int(query_params.get("offset", [0])[0])

            company_id = user.get("company_id") if user else None

            criteria = ParkingSearchCriteria(
                latitude=lat,
                longitude=lon,
                max_distance_km=max_dist,
                max_price_per_hour=price_ceiling,
                category=cat if cat != "ALL" else None,
                require_ev_charging=require_ev,
                require_covered_roof=require_roof,
                require_security_guard=require_security,
                require_anpr=require_anpr,
                company_id=company_id,
                sort_by=sort_by,
                limit=limit,
                offset=offset
            )

            all_zones = ParkingService.get_all_zones()
            search_result = SpatialSearchEngine.filter_and_rank_zones(all_zones, criteria)

            return {
                "success": True,
                "data": search_result
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to execute spatial search query: {str(e)}"
            }
