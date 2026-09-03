"""
SmartPark Sub-Slab Radon Gas (Rn-222) Ionization Sensor & Exfiltration Repository Layer
Manages pulsed ionization chamber radon gas sensors (Bq/m³), sub-slab suction fans, and EPA safe indoor air thresholds.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RadonSensorNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "RADON-ION-B3-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B3 (Lowest Sub-Slab)",
        radon_level_bq_m3: float = 38.4,  # EPA Action Level > 148 Bq/m³ (4.0 pCi/L)
        epa_action_threshold_bq_m3: float = 148.0,
        sub_slab_suction_fan_active: bool = True,
        air_exchange_rate_ach: float = 4.8,
        safety_status: str = "RADON_SAFE_CLEAN",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rdn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.radon_level_bq_m3 = radon_level_bq_m3
        self.epa_action_threshold_bq_m3 = epa_action_threshold_bq_m3
        self.sub_slab_suction_fan_active = sub_slab_suction_fan_active
        self.air_exchange_rate_ach = air_exchange_rate_ach
        self.safety_status = safety_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "radon_level_bq_m3": self.radon_level_bq_m3,
            "epa_action_threshold_bq_m3": self.epa_action_threshold_bq_m3,
            "sub_slab_suction_fan_active": self.sub_slab_suction_fan_active,
            "air_exchange_rate_ach": self.air_exchange_rate_ach,
            "safety_status": self.safety_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RadonSensorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS radon_sensor_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    radon_level_bq_m3 REAL DEFAULT 38.4,
                    epa_action_threshold_bq_m3 REAL DEFAULT 148.0,
                    sub_slab_suction_fan_active INTEGER DEFAULT 1,
                    air_exchange_rate_ach REAL DEFAULT 4.8,
                    safety_status TEXT DEFAULT 'RADON_SAFE_CLEAN',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RadonSensorNode:
        RadonSensorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM radon_sensor_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["sub_slab_suction_fan_active"] = bool(d["sub_slab_suction_fan_active"])
                return RadonSensorNode(**d)
            node = RadonSensorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO radon_sensor_nodes (
                    id, sensor_code, zone_id, floor_level,
                    radon_level_bq_m3, epa_action_threshold_bq_m3,
                    sub_slab_suction_fan_active, air_exchange_rate_ach,
                    safety_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.radon_level_bq_m3, node.epa_action_threshold_bq_m3,
                1 if node.sub_slab_suction_fan_active else 0,
                node.air_exchange_rate_ach, node.safety_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

RadonSensorRepository.init_table()
