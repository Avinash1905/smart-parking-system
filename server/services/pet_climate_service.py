"""
SmartPark Pet-Friendly Parking Climate Service
Monitors cabin interior temperatures (21.8°C) and activates misting fans and fresh water fountains for pet comfort.
"""

from typing import Dict, Any, List
from server.database.repositories.pet_climate_repository import PetClimateRepository

class PetClimateService:
    @staticmethod
    def get_pet_bay_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        stall = PetClimateRepository.get_latest(zone_id)
        return {
            "success": True,
            "pet_stall": stall.to_dict(),
            "heatstroke_alarm_threshold_celsius": 26.0,
            "complimentary_service": True
        }
