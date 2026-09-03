"""
SmartPark IoT Sensor Gateway REST Controller
Ingests live ultrasonic spot sensor pulses, gate loop triggers, and environment readings.
"""

from typing import Dict, Any, List
from datetime import datetime
from server.database.db import db
from server.services.business_services import SlotService

class SensorGatewayController:
    @staticmethod
    def ingest_telemetry_batch(events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Processes batch IoT telemetry packets from microcontrollers (ESP32/LoRaWAN)."""
        processed_count = 0
        with db.get_connection() as conn:
            cursor = conn.cursor()
            for ev in events:
                sensor_id = ev.get("sensor_id")
                slot_id = ev.get("slot_id")
                state = ev.get("state", "FREE")  # OCCUPIED / FREE / ERROR
                distance_cm = ev.get("distance_cm", 250.0)
                battery_v = ev.get("battery_volts", 3.3)

                # Map state to Slot Status
                slot_status = "OCCUPIED" if state == "OCCUPIED" or distance_cm < 60.0 else "AVAILABLE"
                if slot_id:
                    cursor.execute("""
                        UPDATE parking_slots 
                        SET status = ?, last_status_change = ? 
                        WHERE id = ?
                    """, (slot_status, datetime.now().isoformat(), slot_id))
                processed_count += 1

            conn.commit()

        return {
            "success": True,
            "processed_count": processed_count,
            "timestamp": datetime.now().isoformat(),
            "gateway_status": "ONLINE"
        }
