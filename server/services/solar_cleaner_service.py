"""
SmartPark Solar PV Robotic Cleaning Service
Dispatches autonomous waterless robotic cleaners to sweep dust and restore 14.8% photovoltaic yield.
"""

from typing import Dict, Any, List
from server.database.repositories.solar_cleaner_repository import SolarCleanerRepository

class SolarCleanerService:
    @staticmethod
    def get_cleaner_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        bot = SolarCleanerRepository.get_latest(zone_id)
        return {
            "success": True,
            "solar_bot": bot.to_dict(),
            "cleaning_speed_meters_sec": 0.4,
            "next_scheduled_sweep": "Tomorrow, 05:30 AM"
        }
