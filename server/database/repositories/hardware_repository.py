"""
SmartPark Hardware Sensor & IoT Stud Health Repository Layer
Tracks individual ground studs, boom barriers, LoRaWAN gateway signal strengths, and battery degradation.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import Sensor

class HardwareRepository:
    @staticmethod
    def list_all_sensors(zone_id: Optional[str] = None) -> List[Sensor]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM sensors"
            params = []
            if zone_id:
                query += " WHERE zone_id = ?"
                params.append(zone_id)
            query += " ORDER BY sensor_code ASC"

            cursor.execute(query, params)
            sensors = []
            for r in cursor.fetchall():
                d = dict(r)
                d["is_online"] = bool(d["is_online"])
                sensors.append(Sensor(**d))
            return sensors

    @staticmethod
    def update_sensor_reading(sensor_code: str, reading: str, battery_pct: int = 98) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                UPDATE sensors 
                SET current_reading = ?, battery_level_percent = ?, last_heartbeat = ?
                WHERE sensor_code = ?
            """, (reading, battery_pct, now_iso, sensor_code))
            conn.commit()
            return cursor.rowcount > 0
