"""
SmartPark Hydrogen Gas (H2) Sniffer & FCEV Leak Detection Repository Layer
Manages catalytic pellistor H2 gas sensors, ceiling explosion-proof dampers, and lower explosive limit (LEL%) alarms.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class HydrogenLeakSensorNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "H2-SNIFFER-B2-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B2 (Ceiling Vault)",
        h2_concentration_ppm: float = 8.5,
        lower_explosive_limit_pct: float = 0.21,  # 40,000 ppm = 100% LEL. Safe threshold < 10% LEL
        flammable_risk_tier: str = "ATMOSPHERE_SAFE",
        explosion_proof_fan_override_active: bool = False,
        status: str = "H2_MONITORING_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"h2s-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.h2_concentration_ppm = h2_concentration_ppm
        self.lower_explosive_limit_pct = lower_explosive_limit_pct
        self.flammable_risk_tier = flammable_risk_tier
        self.explosion_proof_fan_override_active = explosion_proof_fan_override_active
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "h2_concentration_ppm": self.h2_concentration_ppm,
            "lower_explosive_limit_pct": self.lower_explosive_limit_pct,
            "flammable_risk_tier": self.flammable_risk_tier,
            "explosion_proof_fan_override_active": self.explosion_proof_fan_override_active,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class HydrogenLeakRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS hydrogen_leak_sensor_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    h2_concentration_ppm REAL DEFAULT 8.5,
                    lower_explosive_limit_pct REAL DEFAULT 0.21,
                    flammable_risk_tier TEXT DEFAULT 'ATMOSPHERE_SAFE',
                    explosion_proof_fan_override_active INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'H2_MONITORING_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> HydrogenLeakSensorNode:
        HydrogenLeakRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM hydrogen_leak_sensor_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["explosion_proof_fan_override_active"] = bool(d["explosion_proof_fan_override_active"])
                return HydrogenLeakSensorNode(**d)
            node = HydrogenLeakSensorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO hydrogen_leak_sensor_nodes (
                    id, sensor_code, zone_id, floor_level,
                    h2_concentration_ppm, lower_explosive_limit_pct,
                    flammable_risk_tier,
                    explosion_proof_fan_override_active, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.h2_concentration_ppm, node.lower_explosive_limit_pct,
                node.flammable_risk_tier,
                1 if node.explosion_proof_fan_override_active else 0,
                node.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

HydrogenLeakRepository.init_table()
