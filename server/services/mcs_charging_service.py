"""
SmartPark Megawatt Charging System (MCS 1.2MW) Service
Coordinates ultra-high power 1.2-megawatt DC charging for electric semi-trucks and heavy logistics fleets.
"""

from typing import Dict, Any, List
from server.database.repositories.mcs_charging_repository import MCSChargingRepository

class MCSChargingService:
    @staticmethod
    def get_mcs_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        disp = MCSChargingRepository.get_latest(zone_id)
        return {
            "success": True,
            "mcs_dispenser": disp.to_dict(),
            "max_power_rating_kw": 1200.0,
            "charging_standard": "CHARIN_MCS_MEGAWATT_COMMERCIAL"
        }
