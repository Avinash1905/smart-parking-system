"""
SmartPark Acoustic Noise Level & Decibel Telemetry Repository Layer
Monitors ambient noise (dBA), excessive vehicle honking events, and municipal quiet zone standards.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AcousticTelemetryNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "MIC-CBD-01",
        zone_id: str = "zone-pub-01",
        ambient_noise_dba: float = 54.2,
        honking_spikes_detected_today: int = 1,
        noise_compliance_tier: str = "QUIET_ZONE_COMPLIANT",  # QUIET_ZONE_COMPLIANT | MODERATE | EXCESSIVE_NOISE
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"mic-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.ambient_noise_dba = ambient_noise_dba
        self.honking_spikes_detected_today = honking_spikes_detected_today
        self.noise_compliance_tier = noise_compliance_tier
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "ambient_noise_dba": self.ambient_noise_dba,
            "honking_spikes_detected_today": self.honking_spikes_detected_today,
            "noise_compliance_tier": self.noise_compliance_tier,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class AcousticRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS acoustic_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    ambient_noise_dba REAL DEFAULT 54.2,
                    honking_spikes_detected_today INTEGER DEFAULT 1,
                    noise_compliance_tier TEXT DEFAULT 'QUIET_ZONE_COMPLIANT',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> AcousticTelemetryNode:
        AcousticRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM acoustic_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return AcousticTelemetryNode(**dict(row))
            node = AcousticTelemetryNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO acoustic_nodes (id, sensor_code, zone_id, ambient_noise_dba, honking_spikes_detected_today, noise_compliance_tier, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (node.id, node.sensor_code, node.zone_id, node.ambient_noise_dba, node.honking_spikes_detected_today, node.noise_compliance_tier, datetime.utcnow().isoformat()))
            conn.commit()
            return node

AcousticRepository.init_table()
