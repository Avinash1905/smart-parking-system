"""
SmartPark Driver Child Stroller UV-C Sanitized Rental Bay Service
Provides complimentary UV-C sanitized infant/toddler stroller loans for families visiting the parking facility.
"""

from typing import Dict, Any, List
from server.database.repositories.stroller_bay_repository import StrollerBayRepository

class StrollerBayService:
    @staticmethod
    def get_stroller_bay_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        bay = StrollerBayRepository.get_latest(zone_id)
        return {
            "success": True,
            "stroller_bay": bay.to_dict(),
            "astm_f833_safety_compliant": True,
            "complimentary_service": True
        }
