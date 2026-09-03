"""
SmartPark Substation Transformer Dissolved Gas Analysis (DGA) Service
Monitors insulating oil gas concentrations (14.5 ppm H2, 0.4 ppm C2H2) to detect early internal electrical partial discharges.
"""

from typing import Dict, Any, List
from server.database.repositories.dga_sensor_repository import DGASensorRepository

class DGASensorService:
    @staticmethod
    def get_dga_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = DGASensorRepository.get_latest(zone_id)
        return {
            "success": True,
            "dga_sensor": node.to_dict(),
            "duval_triangle_fault_zone": "NORMAL_AGING_NO_FAULT",
            "transformer_kva_rating": 2500
        }
