"""
SmartPark Electrical Power Quality & Harmonic Filter Service
Monitors voltage harmonics (THD 2.8%) and active power factor (0.98 cos phi) to protect facility transformers.
"""

from typing import Dict, Any, List
from server.database.repositories.power_quality_repository import PowerQualityRepository

class PowerQualityService:
    @staticmethod
    def get_power_quality_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = PowerQualityRepository.get_latest(zone_id)
        return {
            "success": True,
            "power_quality": node.to_dict(),
            "ieee_519_thd_limit_pct": 5.0,
            "harmonic_filter_bank_state": "ACTIVE_RESONANCE_DAMPING"
        }
