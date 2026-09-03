"""
SmartPark Pedestrian Speed Gate Optical Turnstile Service
Controls high-throughput optical turnstiles with anti-tailgating infrared sensors and rapid 0.3s glass flap opening.
"""

from typing import Dict, Any, List
from server.database.repositories.speed_turnstile_repository import SpeedTurnstileRepository

class SpeedTurnstileService:
    @staticmethod
    def get_turnstile_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        lane = SpeedTurnstileRepository.get_latest(zone_id)
        return {
            "success": True,
            "turnstile_lane": lane.to_dict(),
            "flap_opening_time_seconds": 0.3,
            "credential_modes": ["NFC_SMARTPHONE", "QR_CODE_TICKET", "RFID_KEYCARD"]
        }
