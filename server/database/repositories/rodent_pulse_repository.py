"""
SmartPark Ultrasonic Rodent & Pest Pulse Frequency Modulator Repository Layer
Manages swept 20-65 kHz ultrasonic transducer arrays protecting parked vehicle engine wiring harnesses from rodent chewing damage.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RodentPulseNode:
    def __init__(
        self,
        id: str = "",
        node_code: str = "RODENT-PULSE-B2-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B2 Deep Cable Trench",
        ultrasonic_sweep_khz: float = 48.5,
        acoustic_pressure_db: float = 115.0,
        rodent_infestation_events_30d: int = 0,
        wiring_damage_claims_prevented: int = 29,
        protection_state: str = "SWEPT_ULTRASONIC_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rpn-{uuid.uuid4().hex[:8]}"
        self.node_code = node_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.ultrasonic_sweep_khz = ultrasonic_sweep_khz
        self.acoustic_pressure_db = acoustic_pressure_db
        self.rodent_infestation_events_30d = rodent_infestation_events_30d
        self.wiring_damage_claims_prevented = wiring_damage_claims_prevented
        self.protection_state = protection_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "node_code": self.node_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "ultrasonic_sweep_khz": self.ultrasonic_sweep_khz,
            "acoustic_pressure_db": self.acoustic_pressure_db,
            "rodent_infestation_events_30d": self.rodent_infestation_events_30d,
            "wiring_damage_claims_prevented": self.wiring_damage_claims_prevented,
            "protection_state": self.protection_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RodentPulseRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rodent_pulse_nodes (
                    id TEXT PRIMARY KEY,
                    node_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    ultrasonic_sweep_khz REAL DEFAULT 48.5,
                    acoustic_pressure_db REAL DEFAULT 115.0,
                    rodent_infestation_events_30d INTEGER DEFAULT 0,
                    wiring_damage_claims_prevented INTEGER DEFAULT 29,
                    protection_state TEXT DEFAULT 'SWEPT_ULTRASONIC_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RodentPulseNode:
        RodentPulseRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM rodent_pulse_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return RodentPulseNode(**dict(row))
            node = RodentPulseNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO rodent_pulse_nodes (
                    id, node_code, zone_id, floor_level,
                    ultrasonic_sweep_khz, acoustic_pressure_db,
                    rodent_infestation_events_30d,
                    wiring_damage_claims_prevented,
                    protection_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.node_code, node.zone_id, node.floor_level,
                node.ultrasonic_sweep_khz, node.acoustic_pressure_db,
                node.rodent_infestation_events_30d,
                node.wiring_damage_claims_prevented,
                node.protection_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

RodentPulseRepository.init_table()
