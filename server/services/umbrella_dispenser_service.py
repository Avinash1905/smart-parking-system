"""
SmartPark Contactless Rain Umbrella Dispenser Service
Provides automated complimentary umbrella loans during rainy weather with easy RFID return slots.
"""

from typing import Dict, Any, List
from server.database.repositories.umbrella_dispenser_repository import UmbrellaDispenserRepository

class UmbrellaDispenserService:
    @staticmethod
    def get_dispenser_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        station = UmbrellaDispenserRepository.get_latest(zone_id)
        return {
            "success": True,
            "umbrella_station": station.to_dict(),
            "loan_duration_hours": 24,
            "complimentary_service": True
        }
