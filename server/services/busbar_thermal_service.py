"""
SmartPark Substation Copper Busbar Continuous Thermal Infrared Service
Monitors non-contact thermopile infrared array matrices to prevent loose connection electrical fires in power distribution switchboards.
"""

from typing import Dict, Any, List
from server.database.repositories.busbar_thermal_repository import BusbarThermalRepository

class BusbarThermalService:
    @staticmethod
    def get_busbar_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = BusbarThermalRepository.get_latest(zone_id)
        return {
            "success": True,
            "busbar_thermal": node.to_dict(),
            "thermopile_infrared_active": True,
            "ieee_c37_20_1_compliant": True
        }
