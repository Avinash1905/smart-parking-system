"""
SmartPark Portable Magnetic Power Bank Rental Dispenser Service
Provides 10,000mAh magnetic fast-charging power bank loans with 60 minutes complimentary use for drivers.
"""

from typing import Dict, Any, List
from server.database.repositories.battery_booster_repository import BatteryBoosterRepository

class BatteryBoosterService:
    @staticmethod
    def get_booster_station_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        station = BatteryBoosterRepository.get_latest(zone_id)
        return {
            "success": True,
            "booster_station": station.to_dict(),
            "first_hour_free": True,
            "built_in_cables": ["MAGSAFE_WIRELESS", "USB_C_PD", "APPLE_LIGHTNING"]
        }
