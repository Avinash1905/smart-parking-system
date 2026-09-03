"""
SmartPark Foundation Ground Vibration & Triaxial Seismograph Repository Layer
Manages high-sensitivity geophones, peak particle velocity (PPV mm/s) monitoring, DIN 4150 structural vibration compliance, and heavy bus traffic vibration alerts.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class GroundVibrationNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "SEISMO-VIBRATION-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Sub-Foundation Raft Footing",
        measured_ppv_radial_mms: float = 1.45,   # Allowable PPV < 5.0 mm/s DIN 4150
        measured_ppv_transverse_mms: float = 1.12,
        measured_ppv_vertical_mms: float = 1.85,
        dominant_frequency_hz: float = 14.2,
        seismograph_status: str = "VIBRATION_LEVELS_NORMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"gvn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_ppv_radial_mms = measured_ppv_radial_mms
        self.measured_ppv_transverse_mms = measured_ppv_transverse_mms
        self.measured_ppv_vertical_mms = measured_ppv_vertical_mms
        self.dominant_frequency_hz = dominant_frequency_hz
        self.seismograph_status = seismograph_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_ppv_radial_mms": self.measured_ppv_radial_mms,
            "measured_ppv_transverse_mms": self.measured_ppv_transverse_mms,
            "measured_ppv_vertical_mms": self.measured_ppv_vertical_mms,
            "dominant_frequency_hz": self.dominant_frequency_hz,
            "seismograph_status": self.seismograph_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class GroundVibrationRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ground_vibration_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_ppv_radial_mms REAL DEFAULT 1.45,
                    measured_ppv_transverse_mms REAL DEFAULT 1.12,
                    measured_ppv_vertical_mms REAL DEFAULT 1.85,
                    dominant_frequency_hz REAL DEFAULT 14.2,
                    seismograph_status TEXT DEFAULT 'VIBRATION_LEVELS_NORMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> GroundVibrationNode:
        GroundVibrationRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ground_vibration_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return GroundVibrationNode(**dict(row))
            node = GroundVibrationNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO ground_vibration_nodes (
                    id, sensor_code, zone_id, floor_level,
                    measured_ppv_radial_mms,
                    measured_ppv_transverse_mms,
                    measured_ppv_vertical_mms,
                    dominant_frequency_hz,
                    seismograph_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.measured_ppv_radial_mms,
                node.measured_ppv_transverse_mms,
                node.measured_ppv_vertical_mms,
                node.dominant_frequency_hz,
                node.seismograph_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

GroundVibrationRepository.init_table()
