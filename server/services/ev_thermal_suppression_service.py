"""
SmartPark EV Thermal Runaway & Fire Suppression Service
Controls specialized underbody high-pressure water mist nozzles to quench lithium battery cell fires.
"""

from typing import Dict, Any, List
from server.database.repositories.ev_thermal_suppression_repository import EVThermalSuppressionRepository, EVThermalSuppressionZone

class EVThermalSuppressionService:
    @staticmethod
    def get_suppression_status(zone_id: str = "zone-pub-01") -> List[Dict[str, Any]]:
        zones = EVThermalSuppressionRepository.list_by_zone(zone_id)
        if not zones:
            sample = [
                EVThermalSuppressionZone(zone_code="EV-FIRE-A03", slot_code="A-03", battery_pack_temp_celsius=31.5),
                EVThermalSuppressionZone(zone_code="EV-FIRE-A04", slot_code="A-04", battery_pack_temp_celsius=29.8)
            ]
            for s in sample:
                EVThermalSuppressionRepository.create(s)
            zones = EVThermalSuppressionRepository.list_by_zone(zone_id)

        return [z.to_dict() for z in zones]
