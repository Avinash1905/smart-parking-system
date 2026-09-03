"""
SmartPark Driver Windshield Washer Fluid Dispenser Service
Provides complimentary all-season de-bug windshield wiper fluid refills for parked motorists.
"""

from typing import Dict, Any, List
from server.database.repositories.washer_fluid_repository import WasherFluidRepository

class WasherFluidService:
    @staticmethod
    def get_dispenser_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        station = WasherFluidRepository.get_latest(zone_id)
        return {
            "success": True,
            "washer_station": station.to_dict(),
            "max_free_dispense_ml": 2000,
            "complimentary_service": True
        }
