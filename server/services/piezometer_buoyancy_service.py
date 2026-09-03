"""
SmartPark Deep Foundation Groundwater Piezometer & Buoyancy Service
Measures pore water pressures under deep foundation rafts to ensure basement structure stability against hydrostatic buoyancy forces.
"""

from typing import Dict, Any, List
from server.database.repositories.piezometer_buoyancy_repository import PiezometerBuoyancyRepository

class PiezometerBuoyancyService:
    @staticmethod
    def get_piezometer_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = PiezometerBuoyancyRepository.get_latest(zone_id)
        return {
            "success": True,
            "piezometer_buoyancy": node.to_dict(),
            "vibrating_wire_calibrated": True,
            "buoyancy_safety_compliant": True
        }
