"""
SmartPark Open Mobility Data Specification (MDS & GBFS) Export Service
Exports standardized city mobility feeds for municipal planners, Google Maps, and Apple Maps parking layers.
"""

from typing import Dict, Any, List
from datetime import datetime
from server.database.repositories.parking_zone_repository import ParkingZoneRepository

class OpenMobilityDataService:
    @staticmethod
    def get_mds_curb_feed() -> Dict[str, Any]:
        zones = ParkingZoneRepository.list_all()
        return {
            "version": "MDS-Curb-2.0.0",
            "last_updated": datetime.utcnow().isoformat(),
            "ttl": 15,
            "data": {
                "parking_facilities": [
                    {
                        "facility_id": z.id,
                        "name": z.name,
                        "lat": z.latitude,
                        "lon": z.longitude,
                        "capacity": z.total_spaces,
                        "num_available": z.available_spaces,
                        "is_ev_ready": z.ev_spaces > 0,
                        "pricing_tier": f"₹{z.price_per_hour}/hr"
                    }
                    for z in zones
                ]
            }
        }
