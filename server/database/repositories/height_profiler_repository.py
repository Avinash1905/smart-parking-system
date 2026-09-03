"""
SmartPark Overhead Vehicle Height Profiler & Clearance Warning Repository Layer
Manages entry ramp LiDAR optical height curtains, roof-rack/over-height alerts, and low-clearance alarms.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class HeightProfilerNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "HEIGHT-ENTRY-01",
        zone_id: str = "zone-pub-01",
        maximum_safe_clearance_meters: float = 2.20,
        measured_vehicle_height_meters: float = 1.78,
        over_height_alert_triggered: bool = False,
        chime_strobe_activated: bool = False,
        status: str = "CLEARANCE_SAFE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"hgt-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.maximum_safe_clearance_meters = maximum_safe_clearance_meters
        self.measured_vehicle_height_meters = measured_vehicle_height_meters
        self.over_height_alert_triggered = over_height_alert_triggered
        self.chime_strobe_activated = chime_strobe_activated
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "maximum_safe_clearance_meters": self.maximum_safe_clearance_meters,
            "measured_vehicle_height_meters": self.measured_vehicle_height_meters,
            "over_height_alert_triggered": self.over_height_alert_triggered,
            "chime_strobe_activated": self.chime_strobe_activated,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class HeightProfilerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS height_profiler_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    maximum_safe_clearance_meters REAL DEFAULT 2.20,
                    measured_vehicle_height_meters REAL DEFAULT 1.78,
                    over_height_alert_triggered INTEGER DEFAULT 0,
                    chime_strobe_activated INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'CLEARANCE_SAFE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> HeightProfilerNode:
        HeightProfilerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM height_profiler_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["over_height_alert_triggered"] = bool(d["over_height_alert_triggered"])
                d["chime_strobe_activated"] = bool(d["chime_strobe_activated"])
                return HeightProfilerNode(**d)
            node = HeightProfilerNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO height_profiler_nodes (
                    id, sensor_code, zone_id, maximum_safe_clearance_meters,
                    measured_vehicle_height_meters, over_height_alert_triggered,
                    chime_strobe_activated, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id,
                node.maximum_safe_clearance_meters,
                node.measured_vehicle_height_meters,
                1 if node.over_height_alert_triggered else 0,
                1 if node.chime_strobe_activated else 0,
                node.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

HeightProfilerRepository.init_table()
