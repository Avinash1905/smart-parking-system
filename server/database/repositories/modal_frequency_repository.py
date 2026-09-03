"""
SmartPark Structural Modal Frequency & FFT Resonance Acceleration Repository Layer
Manages triaxial wireless MEMS accelerometers measuring fundamental structural natural frequency (Hz) and damping ratios across concrete decks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ModalFrequencyNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "MODAL-MEMS-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Center Span",
        fundamental_frequency_hz: float = 4.82,
        baseline_design_frequency_hz: float = 5.00,
        frequency_stiffness_retention_pct: float = 96.4,
        damping_ratio_zeta_pct: float = 2.15,
        modal_state: str = "STRUCTURAL_STIFFNESS_HEALTHY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"mfn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.fundamental_frequency_hz = fundamental_frequency_hz
        self.baseline_design_frequency_hz = baseline_design_frequency_hz
        self.frequency_stiffness_retention_pct = frequency_stiffness_retention_pct
        self.damping_ratio_zeta_pct = damping_ratio_zeta_pct
        self.modal_state = modal_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "fundamental_frequency_hz": self.fundamental_frequency_hz,
            "baseline_design_frequency_hz": self.baseline_design_frequency_hz,
            "frequency_stiffness_retention_pct": self.frequency_stiffness_retention_pct,
            "damping_ratio_zeta_pct": self.damping_ratio_zeta_pct,
            "modal_state": self.modal_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ModalFrequencyRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS modal_frequency_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    fundamental_frequency_hz REAL DEFAULT 4.82,
                    baseline_design_frequency_hz REAL DEFAULT 5.00,
                    frequency_stiffness_retention_pct REAL DEFAULT 96.4,
                    damping_ratio_zeta_pct REAL DEFAULT 2.15,
                    modal_state TEXT DEFAULT 'STRUCTURAL_STIFFNESS_HEALTHY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ModalFrequencyNode:
        ModalFrequencyRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM modal_frequency_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return ModalFrequencyNode(**dict(row))
            node = ModalFrequencyNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO modal_frequency_nodes (
                    id, sensor_code, zone_id, floor_level,
                    fundamental_frequency_hz,
                    baseline_design_frequency_hz,
                    frequency_stiffness_retention_pct,
                    damping_ratio_zeta_pct, modal_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.fundamental_frequency_hz,
                node.baseline_design_frequency_hz,
                node.frequency_stiffness_retention_pct,
                node.damping_ratio_zeta_pct, node.modal_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ModalFrequencyRepository.init_table()
