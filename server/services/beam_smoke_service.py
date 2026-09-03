"""
SmartPark Optical Projected Beam Smoke Detector (NFPA 72) Service
Monitors infrared line-of-sight smoke obscuration across high-ceiling parking spans ensuring instant fire detection.
"""

from typing import Dict, Any, List
from server.database.repositories.beam_smoke_repository import BeamSmokeRepository

class BeamSmokeService:
    @staticmethod
    def get_beam_smoke_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = BeamSmokeRepository.get_latest(zone_id)
        return {
            "success": True,
            "beam_smoke": node.to_dict(),
            "infrared_wavelength_nm": 880,
            "nfpa_smoke_alarm_threshold_pct_m": 2.50
        }
