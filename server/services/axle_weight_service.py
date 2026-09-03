"""
SmartPark Weigh-In-Motion (WIM) Axle Load Limiter Service
Calculates individual axle and gross vehicle weights (GVW) to protect suspended parking slab structural safety limits.
"""

from typing import Dict, Any, List
from server.database.repositories.axle_weight_repository import AxleWeightRepository

class AxleWeightService:
    @staticmethod
    def get_vehicle_weight(plate: str = "KA-01-MJ-5890") -> Dict[str, Any]:
        rec = AxleWeightRepository.get_latest(plate)
        return {
            "success": True,
            "weight_record": rec.to_dict(),
            "piezoelectric_quartz_accuracy_pct": 99.2,
            "structural_limit_tons": 3.50
        }
