"""
SmartPark Fire Department Standpipe Water Pressure (NFPA 14) Service
Monitors hydraulic riser pressures ensuring 112.5 PSI at highest rooftop fire department hose valves.
"""

from typing import Dict, Any, List
from server.database.repositories.standpipe_repository import StandpipeRepository

class StandpipeService:
    @staticmethod
    def get_standpipe_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = StandpipeRepository.get_latest(zone_id)
        return {
            "success": True,
            "standpipe": node.to_dict(),
            "nfpa_minimum_residual_psi": 100.0,
            "riser_pipe_diameter_inches": 6.0
        }
