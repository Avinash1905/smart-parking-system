"""
SmartPark Child Presence Detection (CPD) & Vehicular Heatstroke Guard Repository Layer
Manages 60GHz millimeter-wave sub-breath radar sensors detecting baby/child presence inside parked cars and sounding automated emergency alarms.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ChildPresenceNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "CPD-RADAR-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Family Parking Zone",
        sub_breath_motion_detected: bool = False,
        cabin_temperature_celsius: float = 23.4,
        heatstroke_risk_level: str = "LOW_RISK_SAFE",
        alarm_horn_strobe_tripped: bool = False,
        system_status: str = "60GHZ_RADAR_SCANNING_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"cpd-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.sub_breath_motion_detected = sub_breath_motion_detected
        self.cabin_temperature_celsius = cabin_temperature_celsius
        self.heatstroke_risk_level = heatstroke_risk_level
        self.alarm_horn_strobe_tripped = alarm_horn_strobe_tripped
        self.system_status = system_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "sub_breath_motion_detected": self.sub_breath_motion_detected,
            "cabin_temperature_celsius": self.cabin_temperature_celsius,
            "heatstroke_risk_level": self.heatstroke_risk_level,
            "alarm_horn_strobe_tripped": self.alarm_horn_strobe_tripped,
            "system_status": self.system_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ChildPresenceRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS child_presence_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    sub_breath_motion_detected INTEGER DEFAULT 0,
                    cabin_temperature_celsius REAL DEFAULT 23.4,
                    heatstroke_risk_level TEXT DEFAULT 'LOW_RISK_SAFE',
                    alarm_horn_strobe_tripped INTEGER DEFAULT 0,
                    system_status TEXT DEFAULT '60GHZ_RADAR_SCANNING_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ChildPresenceNode:
        ChildPresenceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM child_presence_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["sub_breath_motion_detected"] = bool(d["sub_breath_motion_detected"])
                d["alarm_horn_strobe_tripped"] = bool(d["alarm_horn_strobe_tripped"])
                return ChildPresenceNode(**d)
            node = ChildPresenceNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO child_presence_nodes (
                    id, sensor_code, zone_id, floor_level,
                    sub_breath_motion_detected,
                    cabin_temperature_celsius, heatstroke_risk_level,
                    alarm_horn_strobe_tripped, system_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                1 if node.sub_breath_motion_detected else 0,
                node.cabin_temperature_celsius,
                node.heatstroke_risk_level,
                1 if node.alarm_horn_strobe_tripped else 0,
                node.system_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ChildPresenceRepository.init_table()
