"""
SmartPark Electrical Surge Protective Device (SPD Class I+II) Service
Clamps transient overvoltage spikes (100kA 8/20µs) within 25 nanoseconds protecting EV charging stations and facility electronics.
"""

from typing import Dict, Any, List
from server.database.repositories.spd_surge_repository import SPDSurgeRepository

class SPDSurgeService:
    @staticmethod
    def get_spd_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = SPDSurgeRepository.get_latest(zone_id)
        return {
            "success": True,
            "spd_surge": node.to_dict(),
            "clamping_response_time_ns": 25,
            "ieee_c62_41_compliant": True
        }
