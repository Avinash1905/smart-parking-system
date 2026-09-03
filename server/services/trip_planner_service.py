"""
SmartPark Multi-Stop Trip Planner Service Layer
Coordinates multi-destination routing, slot reservations across sequential parking facilities, and timing.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.trip_repository import TripRepository, TripItinerary

class TripPlannerService:
    @staticmethod
    def create_itinerary(data: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        stops = data.get("stops", [
            {"order": 1, "zone_id": "zone-pub-01", "name": "Municipal Central Parking", "duration_hours": 2.0},
            {"order": 2, "zone_id": "zone-pub-04", "name": "Brigade Road Smart Lot", "duration_hours": 1.5}
        ])
        total_dur = sum(s.get("duration_hours", 1.0) for s in stops)

        trip = TripItinerary(
            user_id=user["id"],
            title=data.get("title", "City Business Trip"),
            total_stops=len(stops),
            stops_payload=stops,
            estimated_duration_hours=total_dur,
            status="PLANNED"
        )
        TripRepository.create(trip)
        return {"success": True, "trip_id": trip.id, "data": trip.to_dict()}
