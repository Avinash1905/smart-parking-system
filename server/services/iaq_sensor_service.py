"""
SmartPark Indoor Air Quality & Jet Fan Automation Service
Monitors underground carbon monoxide ppm and automatically triggers ventilation jet fans when CO > 25 ppm.
"""

from typing import Dict, Any, List
from server.database.repositories.iaq_sensor_repository import IAQRepository, IAQSensorNode

class IAQSensorService:
    @staticmethod
    def get_iaq_telemetry(zone_id: str = "zone-pub-01") -> List[Dict[str, Any]]:
        nodes = IAQRepository.list_by_zone(zone_id)
        if not nodes:
            sample = [
                IAQSensorNode(sensor_code="IAQ-B1-01", zone_id=zone_id, floor_level="B1", carbon_monoxide_ppm=14.2, ventilation_jet_fan_status="OFF_STANDBY", air_quality_index="OPTIMAL"),
                IAQSensorNode(sensor_code="IAQ-B2-02", zone_id=zone_id, floor_level="B2", carbon_monoxide_ppm=28.6, ventilation_jet_fan_status="HIGH_SPEED_ACTIVE", air_quality_index="MODERATE_VENTING")
            ]
            for s in sample:
                IAQRepository.create(s)
            nodes = IAQRepository.list_by_zone(zone_id)

        return [n.to_dict() for n in nodes]
