"""
SmartPark Substation Transient Earth Voltage (TEV) & Partial Discharge Acoustic Correlator Repository Layer
Manages high-frequency current transformers (HFCT), ultrasonic acoustic contact probes (dBµV), and high-voltage insulation partial discharge analytics.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PartialDischargeNode:
    def __init__(
        self,
        id: str = "",
        node_code: str = "PD-TEV-SUBSTATION-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation 11kV Switchgear Cubicle",
        tev_signal_magnitude_dbuv: float = 6.4,  # IEEE 400.3 Critical Discharge > 29.0 dBµV
        acoustic_ultrasonic_dbuv: float = 2.1,
        partial_discharge_repetition_rate_pps: int = 12,
        apparent_charge_picocoulombs_pc: float = 45.0,
        insulation_health_status: str = "INSULATION_DIELECTRIC_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"pdn-{uuid.uuid4().hex[:8]}"
        self.node_code = node_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.tev_signal_magnitude_dbuv = tev_signal_magnitude_dbuv
        self.acoustic_ultrasonic_dbuv = acoustic_ultrasonic_dbuv
        self.partial_discharge_repetition_rate_pps = partial_discharge_repetition_rate_pps
        self.apparent_charge_picocoulombs_pc = apparent_charge_picocoulombs_pc
        self.insulation_health_status = insulation_health_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "node_code": self.node_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "tev_signal_magnitude_dbuv": self.tev_signal_magnitude_dbuv,
            "acoustic_ultrasonic_dbuv": self.acoustic_ultrasonic_dbuv,
            "partial_discharge_repetition_rate_pps": self.partial_discharge_repetition_rate_pps,
            "apparent_charge_picocoulombs_pc": self.apparent_charge_picocoulombs_pc,
            "insulation_health_status": self.insulation_health_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PartialDischargeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS partial_discharge_nodes (
                    id TEXT PRIMARY KEY,
                    node_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    tev_signal_magnitude_dbuv REAL DEFAULT 6.4,
                    acoustic_ultrasonic_dbuv REAL DEFAULT 2.1,
                    partial_discharge_repetition_rate_pps INTEGER DEFAULT 12,
                    apparent_charge_picocoulombs_pc REAL DEFAULT 45.0,
                    insulation_health_status TEXT DEFAULT 'INSULATION_DIELECTRIC_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> PartialDischargeNode:
        PartialDischargeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM partial_discharge_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return PartialDischargeNode(**dict(row))
            node = PartialDischargeNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO partial_discharge_nodes (
                    id, node_code, zone_id, floor_level,
                    tev_signal_magnitude_dbuv, acoustic_ultrasonic_dbuv,
                    partial_discharge_repetition_rate_pps,
                    apparent_charge_picocoulombs_pc,
                    insulation_health_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.node_code, node.zone_id, node.floor_level,
                node.tev_signal_magnitude_dbuv,
                node.acoustic_ultrasonic_dbuv,
                node.partial_discharge_repetition_rate_pps,
                node.apparent_charge_picocoulombs_pc,
                node.insulation_health_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

PartialDischargeRepository.init_table()
