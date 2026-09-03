"""
SmartPark Post-Tension Tendon Acoustic Emission (AE) Wire-Break Monitor Repository Layer
Manages 100kHz-400kHz piezoelectric ultrasonic acoustic transducers, tendon wire snap detection, energy burst analysis, and structural fatigue warnings.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AcousticEmissionNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "AE-TENDON-SENSOR-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor 2 Post-Tensioned Slab Girders",
        measured_ae_events_24h: int = 0,
        wire_break_detected: bool = False,
        background_noise_level_db: float = 38.4,
        energy_burst_counts: int = 2,
        sensor_health_status: str = "ACOUSTIC_TRANSDUCERS_HEALTHY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ae-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_ae_events_24h = measured_ae_events_24h
        self.wire_break_detected = wire_break_detected
        self.background_noise_level_db = background_noise_level_db
        self.energy_burst_counts = energy_burst_counts
        self.sensor_health_status = sensor_health_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_ae_events_24h": self.measured_ae_events_24h,
            "wire_break_detected": self.wire_break_detected,
            "background_noise_level_db": self.background_noise_level_db,
            "energy_burst_counts": self.energy_burst_counts,
            "sensor_health_status": self.sensor_health_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class AcousticEmissionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS acoustic_emission_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_ae_events_24h INTEGER DEFAULT 0,
                    wire_break_detected INTEGER DEFAULT 0,
                    background_noise_level_db REAL DEFAULT 38.4,
                    energy_burst_counts INTEGER DEFAULT 2,
                    sensor_health_status TEXT DEFAULT 'ACOUSTIC_TRANSDUCERS_HEALTHY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> AcousticEmissionNode:
        AcousticEmissionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM acoustic_emission_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["wire_break_detected"] = bool(d["wire_break_detected"])
                return AcousticEmissionNode(**d)
            node = AcousticEmissionNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO acoustic_emission_nodes (
                    id, sensor_code, zone_id, floor_level,
                    measured_ae_events_24h, wire_break_detected,
                    background_noise_level_db, energy_burst_counts,
                    sensor_health_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.measured_ae_events_24h,
                1 if node.wire_break_detected else 0,
                node.background_noise_level_db,
                node.energy_burst_counts,
                node.sensor_health_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

AcousticEmissionRepository.init_table()
