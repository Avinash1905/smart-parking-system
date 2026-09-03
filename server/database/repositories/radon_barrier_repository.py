"""
SmartPark Sub-Slab Radon & Hydrocarbon Vapor Mitigation Membrane Repository Layer
Manages differential sub-slab depressurization (SSD) pressure transmitters, radon gas Bq/m3 detectors, and vapor barrier puncture alarms.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RadonBarrierNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "RADON-VAPOR-BARRIER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Basement B3 Sub-Slab Membrane Layer",
        measured_radon_level_bq_m3: float = 24.5,     # EPA safety limit < 148.0 Bq/m3
        sub_slab_vacuum_pressure_pa: float = -45.0,  # Negative vacuum pressure ensures safe venting
        membrane_integrity_status: str = "VAPOR_BARRIER_SEALED",
        radon_fan_state: str = "ACTIVE_CONTINUOUS_EXTRACTION",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rbn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_radon_level_bq_m3 = measured_radon_level_bq_m3
        self.sub_slab_vacuum_pressure_pa = sub_slab_vacuum_pressure_pa
        self.membrane_integrity_status = membrane_integrity_status
        self.radon_fan_state = radon_fan_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_radon_level_bq_m3": self.measured_radon_level_bq_m3,
            "sub_slab_vacuum_pressure_pa": self.sub_slab_vacuum_pressure_pa,
            "membrane_integrity_status": self.membrane_integrity_status,
            "radon_fan_state": self.radon_fan_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RadonBarrierRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS radon_barrier_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_radon_level_bq_m3 REAL DEFAULT 24.5,
                    sub_slab_vacuum_pressure_pa REAL DEFAULT -45.0,
                    membrane_integrity_status TEXT DEFAULT 'VAPOR_BARRIER_SEALED',
                    radon_fan_state TEXT DEFAULT 'ACTIVE_CONTINUOUS_EXTRACTION',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RadonBarrierNode:
        RadonBarrierRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM radon_barrier_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return RadonBarrierNode(**dict(row))
            node = RadonBarrierNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO radon_barrier_nodes (
                    id, sensor_code, zone_id, floor_level,
                    measured_radon_level_bq_m3,
                    sub_slab_vacuum_pressure_pa,
                    membrane_integrity_status, radon_fan_state,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.measured_radon_level_bq_m3,
                node.sub_slab_vacuum_pressure_pa,
                node.membrane_integrity_status,
                node.radon_fan_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

RadonBarrierRepository.init_table()
