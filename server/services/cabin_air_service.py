"""
SmartPark Driver Cabin Air Sanitization & Defogging Service
Provides complimentary 350-CFM high-flow HEPA purifiers and anti-fog ceramic sprays for parked cars.
"""

from typing import Dict, Any, List
from server.database.repositories.cabin_air_repository import CabinAirRepository

class CabinAirService:
    @staticmethod
    def get_station_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        station = CabinAirRepository.get_latest(zone_id)
        return {
            "success": True,
            "cabin_station": station.to_dict(),
            "cycle_duration_minutes": 5,
            "complimentary_service": True
        }
