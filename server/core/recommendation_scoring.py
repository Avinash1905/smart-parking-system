"""
SmartPark Multi-Factor Recommendation Scoring Matrix
Scores and ranks parking facilities based on distance penalty, price utility, historical vacancy certainty, EV amenities, and corporate eligibility.
"""

from typing import Dict, List, Any, Optional

class RecommendationEngine:
    @staticmethod
    def compute_facility_score(
        zone: Dict[str, Any],
        user: Optional[Dict[str, Any]] = None,
        target_lat: float = 12.9716,
        target_lon: float = 77.5946,
        vehicle_is_ev: bool = False
    ) -> Dict[str, Any]:
        """Calculates normalized score (0-100) with detailed contributing factors."""
        # 1. Proximity Utility (Weight: 35%)
        dist_km = float(zone.get("computed_distance_km", zone.get("distance_km", 2.0)))
        dist_score = max(0.0, 100.0 - (dist_km * 12.0))
        weighted_dist = dist_score * 0.35

        # 2. Availability Utility (Weight: 30%)
        total = max(1, int(zone.get("total_spaces", 100)))
        avail = int(zone.get("available_spaces", 50))
        avail_ratio = avail / total
        avail_score = min(100.0, avail_ratio * 120.0)
        weighted_avail = avail_score * 0.30

        # 3. Price Value Utility (Weight: 20%)
        price = float(zone.get("price_per_hour", 20.0))
        # Benchmarked against ₹40/hr standard rate
        price_score = max(0.0, 100.0 - (price * 1.8))
        weighted_price = price_score * 0.20

        # 4. Amenities & Security (Weight: 10%)
        amenity_points = 0
        if bool(zone.get("covered_roof", 0)):
            amenity_points += 25
        if bool(zone.get("security_guard_on_site", 0)):
            amenity_points += 25
        if bool(zone.get("anpr_camera_installed", 0)):
            amenity_points += 25
        if int(zone.get("ev_spaces", 0)) > 0:
            amenity_points += 25
        weighted_amenities = amenity_points * 0.10

        # 5. User Personalization & Affiliation Match (Weight: 5% + Bonus)
        affiliation_bonus = 0.0
        match_reasons = []
        
        if user:
            user_comp = (user.get("company_id") or "").lower().replace("comp-", "")
            zone_comp = (zone.get("company_id") or "").lower().replace("comp-", "")
            if user_comp and zone_comp and user_comp == zone_comp:
                affiliation_bonus += 15.0
                match_reasons.append("Exclusive Employee Access Privileges")

        if vehicle_is_ev and int(zone.get("ev_spaces", 0)) > 0:
            affiliation_bonus += 5.0
            match_reasons.append(f"Dedicated EV Charging Available ({zone.get('ev_spaces')} Bays)")

        if dist_km < 1.0:
            match_reasons.append(f"Immediate Proximity ({dist_km} km / {zone.get('walking_minutes', 3)} min walk)")
        if avail_ratio > 0.4:
            match_reasons.append(f"High Bay Availability ({avail} Open Slots)")
        if price <= 25.0:
            match_reasons.append(f"Economical Rate (₹{price:.0f}/hr)")

        total_score = round(min(100.0, max(10.0, weighted_dist + weighted_avail + weighted_price + weighted_amenities + affiliation_bonus)), 1)

        return {
            "zone_id": zone.get("id"),
            "zone_name": zone.get("name"),
            "category": zone.get("category"),
            "total_score": total_score,
            "match_percentage": int(round(total_score)),
            "score_breakdown": {
                "proximity_score": round(dist_score, 1),
                "availability_score": round(avail_score, 1),
                "price_value_score": round(price_score, 1),
                "amenities_score": round(amenity_points, 1),
                "affiliation_bonus": round(affiliation_bonus, 1)
            },
            "primary_match_reasons": match_reasons[:3],
            "price_per_hour": price,
            "distance_km": dist_km,
            "walking_minutes": int(zone.get("walking_minutes", 5)),
            "available_spaces": avail,
            "total_spaces": total,
            "ev_spaces": int(zone.get("ev_spaces", 0))
        }

    @staticmethod
    def rank_all_recommendations(
        zones: List[Dict[str, Any]],
        user: Optional[Dict[str, Any]] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        scored = [RecommendationEngine.compute_facility_score(z, user) for z in zones]
        scored.sort(key=lambda x: x["total_score"], reverse=True)
        return scored[:limit]
