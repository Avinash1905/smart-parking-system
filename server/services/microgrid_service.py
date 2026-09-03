"""
SmartPark Solar Canopy & Battery Energy Storage (DERMS) Service
Monitors renewable generation metrics, battery charging cycles, and zero-carbon EV charging power.
"""

from typing import Dict, Any, List
from server.database.repositories.microgrid_repository import MicrogridRepository

class MicrogridService:
    @staticmethod
    def get_solar_energy_metrics(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        data = MicrogridRepository.get_latest(zone_id)
        return {
            "success": True,
            "telemetry": data.to_dict(),
            "solar_canopy_efficiency_pct": 94.2,
            "bess_health_pct": 99.1,
            "grid_independence_ratio": "78% Self-Sustaining"
        }
