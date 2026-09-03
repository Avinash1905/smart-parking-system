"""
SmartPark Dynamic Tariff Matrix & Peak Surge Pricing Service
Calculates yield-optimized parking fees dynamically based on live bay occupancy, duration curves, and time-of-day tariffs.
"""

from typing import Dict, Any, List
from server.database.repositories.tariff_matrix_repository import TariffMatrixRepository

class TariffMatrixService:
    @staticmethod
    def get_tariff_structure(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        rule = TariffMatrixRepository.get_latest(zone_id)
        return {
            "success": True,
            "tariff_rule": rule.to_dict(),
            "dynamic_pricing_algorithm": "EXPONENTIAL_OCCUPANCY_CURVE",
            "revenue_optimization_active": True
        }
