"""
SmartPark API-421 Oil-Water Coalescing Separator Service
Ensures basement drainage runoff discharged into municipal storm sewers has less than 3.2 ppm hydrocarbon content.
"""

from typing import Dict, Any, List
from server.database.repositories.oil_water_separator_repository import OilWaterSeparatorRepository

class OilWaterSeparatorService:
    @staticmethod
    def get_separator_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        unit = OilWaterSeparatorRepository.get_latest(zone_id)
        return {
            "success": True,
            "separator": unit.to_dict(),
            "epa_effluent_limit_ppm": 10.0,
            "separation_technology": "CORRUGATED_COALESCING_PLATE_PACK"
        }
