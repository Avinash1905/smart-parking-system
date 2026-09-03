"""
SmartPark Substation SF6 Decomposition Byproduct Photoacoustic Spectrometer Service
Measures sulfur dioxide (SO2) and hydrogen fluoride (HF) decomposition gases to detect internal partial discharge and arc faults.
"""

from typing import Dict, Any, List
from server.database.repositories.sf6_decomposition_repository import SF6DecompositionRepository

class SF6DecompositionService:
    @staticmethod
    def get_spectrometer_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = SF6DecompositionRepository.get_latest(zone_id)
        return {
            "success": True,
            "sf6_decomposition": node.to_dict(),
            "photoacoustic_infrared_active": True,
            "iec_60480_compliant": True
        }
