"""
SmartPark Post-Tensioned Concrete Tendon Load Cell Repository Layer
Manages vibrating wire strain transducers measuring post-tensioned tendon loads (kN) across long-span concrete parking decks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PostTensionNode:
    def __init__(
        self,
        id: str = "",
        cell_code: str = "PT-LOAD-CELL-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Long-Span Girder",
        measured_tendon_tension_kn: float = 1420.5,
        nominal_design_tension_kn: float = 1450.0,
        elastic_shortening_pct: float = 2.03,
        vibrating_wire_resonant_hz: float = 2415.8,
        structural_integrity: str = "TENDON_LOAD_STABLE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ptc-{uuid.uuid4().hex[:8]}"
        self.cell_code = cell_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_tendon_tension_kn = measured_tendon_tension_kn
        self.nominal_design_tension_kn = nominal_design_tension_kn
        self.elastic_shortening_pct = elastic_shortening_pct
        self.vibrating_wire_resonant_hz = vibrating_wire_resonant_hz
        self.structural_integrity = structural_integrity
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "cell_code": self.cell_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_tendon_tension_kn": self.measured_tendon_tension_kn,
            "nominal_design_tension_kn": self.nominal_design_tension_kn,
            "elastic_shortening_pct": self.elastic_shortening_pct,
            "vibrating_wire_resonant_hz": self.vibrating_wire_resonant_hz,
            "structural_integrity": self.structural_integrity,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PostTensionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS post_tension_nodes (
                    id TEXT PRIMARY KEY,
                    cell_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_tendon_tension_kn REAL DEFAULT 1420.5,
                    nominal_design_tension_kn REAL DEFAULT 1450.0,
                    elastic_shortening_pct REAL DEFAULT 2.03,
                    vibrating_wire_resonant_hz REAL DEFAULT 2415.8,
                    structural_integrity TEXT DEFAULT 'TENDON_LOAD_STABLE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> PostTensionNode:
        PostTensionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM post_tension_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return PostTensionNode(**dict(row))
            node = PostTensionNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO post_tension_nodes (
                    id, cell_code, zone_id, floor_level,
                    measured_tendon_tension_kn, nominal_design_tension_kn,
                    elastic_shortening_pct, vibrating_wire_resonant_hz,
                    structural_integrity, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.cell_code, node.zone_id, node.floor_level,
                node.measured_tendon_tension_kn,
                node.nominal_design_tension_kn,
                node.elastic_shortening_pct,
                node.vibrating_wire_resonant_hz,
                node.structural_integrity, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

PostTensionRepository.init_table()
