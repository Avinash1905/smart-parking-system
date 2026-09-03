"""
SmartPark Fiber Bragg Grating (FBG) Optical Structural Strain Service
Interrogates fiber optic light reflection spectrum to detect sub-millimeter deck deflections and thermal expansion.
"""

from typing import Dict, Any, List
from server.database.repositories.fbg_strain_repository import FBGStrainRepository

class FBGStrainService:
    @staticmethod
    def get_fbg_strain_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = FBGStrainRepository.get_latest(zone_id)
        return {
            "success": True,
            "fbg_strain": node.to_dict(),
            "interrogator_wavelength_band_nm": "1510 - 1590 nm",
            "gauge_gauge_factor_pm_ue": 1.20
        }
