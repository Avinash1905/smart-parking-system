"""
SmartPark IoT Sensor Firmware Over-The-Air (OTA) Distribution Service
Coordinates zero-downtime wireless firmware flashes over 802.15.4 6LoWPAN sensor mesh networks.
"""

from typing import Dict, Any, List
from server.database.repositories.sensor_ota_repository import SensorOTARepository

class SensorOTAService:
    @staticmethod
    def get_ota_rollout_status() -> Dict[str, Any]:
        ota = SensorOTARepository.get_latest()
        return {
            "success": True,
            "ota": ota.to_dict(),
            "mesh_protocol": "6LoWPAN_COAP",
            "ota_broadcast_bandwidth_kbps": 250.0
        }
