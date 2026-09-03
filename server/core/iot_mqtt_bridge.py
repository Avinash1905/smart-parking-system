"""
SmartPark IoT Sensor Gateway & MQTT Telemetry Bridge
Emulates ISO/IEC 20922 MQTT broker pub/sub pipelines, ultrasonic stall stud telemetry, and battery health heartbeats.
"""

import json
import uuid
from typing import Dict, List, Any, Optional
from datetime import datetime

class IOTMQTTBridge:
    @staticmethod
    def publish_sensor_heartbeat(
        sensor_code: str,
        zone_id: str,
        slot_number: str,
        reading_state: str = "OCCUPIED",
        battery_pct: int = 96,
        rssi_dbm: int = -64
    ) -> Dict[str, Any]:
        """Formats and publishes simulated QOS 1 MQTT telemetry packet to edge broker."""
        packet_id = f"pkt-{uuid.uuid4().hex[:8]}"
        topic = f"smartpark/zones/{zone_id}/sensors/{sensor_code}/telemetry"

        payload = {
            "message_id": packet_id,
            "sensor_code": sensor_code,
            "zone_id": zone_id,
            "slot_number": slot_number,
            "state": reading_state,
            "battery_level_percent": battery_pct,
            "rssi_dbm": rssi_dbm,
            "firmware_version": "v2.4.1",
            "ambient_temp_celsius": 28.4,
            "timestamp_iso": datetime.utcnow().isoformat()
        }

        return {
            "topic": topic,
            "qos": 1,
            "retained": False,
            "payload": payload,
            "delivery_status": "BROKER_ACK_RECEIVED",
            "latency_ms": 14.2
        }
