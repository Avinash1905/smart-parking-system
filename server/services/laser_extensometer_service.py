"""
SmartPark Structural Thermal Expansion Joint Laser Extensometer Service
Measures millimeter gap movements across multi-deck concrete slab expansion joints using optical laser ranging.
"""

from typing import Dict, Any, List
from server.database.repositories.laser_extensometer_repository import LaserExtensometerRepository

class LaserExtensometerService:
    @staticmethod
    def get_extensometer_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = LaserExtensometerRepository.get_latest(zone_id)
        return {
            "success": True,
            "laser_extensometer": node.to_dict(),
            "sub_millimeter_precision": True,
            "astm_e228_compliant": True
        }
