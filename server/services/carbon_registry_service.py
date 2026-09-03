"""
SmartPark Carbon Credit Registry & Verified Carbon Standard Service
Calculates verified CO2 abatement offsets generated through solar microgrids and EV green charging.
"""

from typing import Dict, Any, List
from server.database.repositories.carbon_registry_repository import CarbonRegistryRepository

class CarbonRegistryService:
    @staticmethod
    def get_carbon_credits_summary(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        cert = CarbonRegistryRepository.get_latest(zone_id)
        return {
            "success": True,
            "carbon_certificate": cert.to_dict(),
            "market_value_per_ton_usd": 28.50,
            "total_facility_carbon_value_usd": round(cert.metric_tons_co2_offset * 28.50, 2)
        }
