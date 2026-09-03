"""
SmartPark Smart Grid Demand-Response & Peak Shaving Service
Coordinates V2G battery discharge and utility curtailment rebates with local power utilities (BESCOM).
"""

from typing import Dict, Any, List
from server.database.repositories.grid_arbitrage_repository import GridArbitrageRepository

class GridArbitrageService:
    @staticmethod
    def get_demand_response_status() -> Dict[str, Any]:
        evt = GridArbitrageRepository.get_latest()
        return {
            "success": True,
            "event": evt.to_dict(),
            "utility_grid_frequency_hz": 50.02,
            "grid_status": "STABLE_NORMAL"
        }
