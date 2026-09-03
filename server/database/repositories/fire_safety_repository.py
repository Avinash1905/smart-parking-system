"""
SmartPark Fire Safety & Automated Sprinkler Zone Repository Layer
Manages thermal heat detectors, optical smoke sensors, dry-pipe sprinkler deluge valves, and emergency egress lighting.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FireSafetyZone:
    def __init__(
        self,
        id: str = "",
        zone_code: str = "FIRE-ZONE-B1-NORTH",
        parking_zone_id: str = "zone-pub-01",
        floor_level: str = "B1",
        smoke_detector_state: str = "CLEAR",  # CLEAR | SMOKE_DETECTED | FAULT
        thermal_heat_sensor_celsius: float = 24.8,
        sprinkler_deluge_valve_status: str = "CHARGED_STANDBY",  # CHARGED_STANDBY | DISCHARGING | SHUTOFF
        emergency_exit_lighting_active: bool = True,
        fire_alarm_state: str = "NORMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"fire-{uuid.uuid4().hex[:8]}"
        self.zone_code = zone_code
        self.parking_zone_id = parking_zone_id
        self.floor_level = floor_level
        self.smoke_detector_state = smoke_detector_state
        self.thermal_heat_sensor_celsius = thermal_heat_sensor_celsius
        self.sprinkler_deluge_valve_status = sprinkler_deluge_valve_status
        self.emergency_exit_lighting_active = emergency_exit_lighting_active
        self.fire_alarm_state = fire_alarm_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "zone_code": self.zone_code,
            "parking_zone_id": self.parking_zone_id,
            "floor_level": self.floor_level,
            "smoke_detector_state": self.smoke_detector_state,
            "thermal_heat_sensor_celsius": self.thermal_heat_sensor_celsius,
            "sprinkler_deluge_valve_status": self.sprinkler_deluge_valve_status,
            "emergency_exit_lighting_active": self.emergency_exit_lighting_active,
            "fire_alarm_state": self.fire_alarm_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FireSafetyRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS fire_safety_zones (
                    id TEXT PRIMARY KEY,
                    zone_code TEXT UNIQUE NOT NULL,
                    parking_zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    smoke_detector_state TEXT DEFAULT 'CLEAR',
                    thermal_heat_sensor_celsius REAL DEFAULT 24.8,
                    sprinkler_deluge_valve_status TEXT DEFAULT 'CHARGED_STANDBY',
                    emergency_exit_lighting_active INTEGER DEFAULT 1,
                    fire_alarm_state TEXT DEFAULT 'NORMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_by_zone(parking_zone_id: str = "zone-pub-01") -> List[FireSafetyZone]:
        FireSafetyRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM fire_safety_zones WHERE parking_zone_id = ? ORDER BY zone_code ASC", (parking_zone_id,))
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["emergency_exit_lighting_active"] = bool(d["emergency_exit_lighting_active"])
                res.append(FireSafetyZone(**d))
            return res

    @staticmethod
    def create(item: FireSafetyZone) -> bool:
        FireSafetyRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO fire_safety_zones (
                    id, zone_code, parking_zone_id, floor_level,
                    smoke_detector_state, thermal_heat_sensor_celsius,
                    sprinkler_deluge_valve_status,
                    emergency_exit_lighting_active, fire_alarm_state,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.zone_code, item.parking_zone_id, item.floor_level,
                item.smoke_detector_state, item.thermal_heat_sensor_celsius,
                item.sprinkler_deluge_valve_status,
                1 if item.emergency_exit_lighting_active else 0,
                item.fire_alarm_state, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

FireSafetyRepository.init_table()
