"""
SmartPark Low-Frequency Active Noise Cancellation (ANC) Acoustic Barrier Repository Layer
Manages anti-phase acoustic transducers, DSP noise cancellation algorithms, boundary decibel reduction (dB), and exhaust rumble suppression.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ActiveNoiseNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "ANC-BARRIER-SYSTEM-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Ramp Exit Boundary Wall",
        ambient_noise_level_db: float = 78.4,
        noise_reduction_delta_db: float = 18.5,  # 18.5 dB anti-phase attenuation
        attenuated_noise_level_db: float = 59.9, # Target < 65 dB municipal limit
        dsp_anti_phase_status: str = "ACTIVE_NOISE_CANCELLATION_ARMED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"anb-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.ambient_noise_level_db = ambient_noise_level_db
        self.noise_reduction_delta_db = noise_reduction_delta_db
        self.attenuated_noise_level_db = attenuated_noise_level_db
        self.dsp_anti_phase_status = dsp_anti_phase_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "ambient_noise_level_db": self.ambient_noise_level_db,
            "noise_reduction_delta_db": self.noise_reduction_delta_db,
            "attenuated_noise_level_db": self.attenuated_noise_level_db,
            "dsp_anti_phase_status": self.dsp_anti_phase_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ActiveNoiseRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS active_noise_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    ambient_noise_level_db REAL DEFAULT 78.4,
                    noise_reduction_delta_db REAL DEFAULT 18.5,
                    attenuated_noise_level_db REAL DEFAULT 59.9,
                    dsp_anti_phase_status TEXT DEFAULT 'ACTIVE_NOISE_CANCELLATION_ARMED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ActiveNoiseNode:
        ActiveNoiseRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM active_noise_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return ActiveNoiseNode(**dict(row))
            node = ActiveNoiseNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO active_noise_nodes (
                    id, unit_code, zone_id, floor_level,
                    ambient_noise_level_db,
                    noise_reduction_delta_db,
                    attenuated_noise_level_db,
                    dsp_anti_phase_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.ambient_noise_level_db,
                node.noise_reduction_delta_db,
                node.attenuated_noise_level_db,
                node.dsp_anti_phase_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ActiveNoiseRepository.init_table()
