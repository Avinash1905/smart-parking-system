"""
SmartPark Two-Wheeler Helmet UV-C Sanitizer Lockbox Service
Provides 90-second 254nm ultraviolet germicidal sterilization destroying 99.99% bacteria in rider helmets.
"""

from typing import Dict, Any, List
from server.database.repositories.helmet_sanitizer_repository import HelmetSanitizerRepository

class HelmetSanitizerService:
    @staticmethod
    def get_sanitizer_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        locker = HelmetSanitizerRepository.get_latest(zone_id)
        return {
            "success": True,
            "helmet_locker": locker.to_dict(),
            "uvc_wavelength_nm": 253.7,
            "complimentary_service": True
        }
