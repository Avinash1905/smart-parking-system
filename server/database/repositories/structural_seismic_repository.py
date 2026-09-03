"""
SmartPark Concrete Structural Health & Seismic Vibration Repository Layer
Monitors multi-level parking deck concrete slab strain gauges, tri-axial MEMS accelerometers, and seismic resonance.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class StructuralVibrationNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "MEMS-DECK-B1-04",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1",
        vibration_velocity_mm_s: float = 0.42,
        concrete_slab_microstrain: float = 18.5,
        resonance_frequency_hz: float = 4.8,
        structural_safety_tier: str = "STRUCTURALLY_SOUND",  # STRUCTURALLY_SOUND | ELEVATED_LOAD | CRITICAL_STRESS
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"vib-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.vibration_velocity_mm_s = vibration_velocity_mm_s
        self.concrete_slab_microstrain = concrete_slab_microstrain
        self.resonance_frequency_hz = resonance_frequency_hz
        self.structural_safety_tier = structural_safety_tier
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "vibration_velocity_mm_s": self.vibration_velocity_mm_s,
            "concrete_slab_microstrain": self.concrete_slab_microstrain,
            "resonance_frequency_hz": self.resonance_frequency_hz,
            "structural_safety_tier": self.structural_safety_tier,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class StructuralSeismicRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS structural_vibration_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    vibration_velocity_mm_s REAL DEFAULT 0.42,
                    concrete_slab_microstrain REAL DEFAULT 18.5,
                    resonance_frequency_hz REAL DEFAULT 4.8,
                    structural_safety_tier TEXT DEFAULT 'STRUCTURALLY_SOUND',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> StructuralVibrationNode:
        StructuralSeismicRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM structural_vibration_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return StructuralVibrationNode(**dict(row))
            node = StructuralVibrationNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO structural_vibration_nodes (
                    id, sensor_code, zone_id, floor_level,
                    vibration_velocity_mm_s, concrete_slab_microstrain,
                    resonance_frequency_hz, structural_safety_tier, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.vibration_velocity_mm_s, node.concrete_slab_microstrain,
                node.resonance_frequency_hz, node.structural_safety_tier,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

StructuralSeismicRepository.init_table()
