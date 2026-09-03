"""
SmartPark Substation High-Speed Arc Quenching & Pressure Relief Burst Disc Repository Layer
Manages 4ms ultra-fast pyrotechnic arc shorting switches, optical fiber arc light sensors, and GIS enclosure overpressure burst discs.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ArcQuenchNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "ARC-QUENCH-SUBSTATION-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation 11kV Feeder Section",
        optical_fiber_arc_detected: bool = False,
        pyrotechnic_igniter_health: str = "IGNITER_CIRCUIT_CONTINUITY_HEALTHY",
        arc_quench_reaction_time_ms: float = 3.8,  # IEEE C37.20.7 limit < 5.0 ms
        burst_disc_rupture_pressure_bar: float = 12.0,
        enclosure_protection_state: str = "ARC_FLASH_CONTAINMENT_ARMED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"aqn-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.optical_fiber_arc_detected = optical_fiber_arc_detected
        self.pyrotechnic_igniter_health = pyrotechnic_igniter_health
        self.arc_quench_reaction_time_ms = arc_quench_reaction_time_ms
        self.burst_disc_rupture_pressure_bar = burst_disc_rupture_pressure_bar
        self.enclosure_protection_state = enclosure_protection_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "optical_fiber_arc_detected": self.optical_fiber_arc_detected,
            "pyrotechnic_igniter_health": self.pyrotechnic_igniter_health,
            "arc_quench_reaction_time_ms": self.arc_quench_reaction_time_ms,
            "burst_disc_rupture_pressure_bar": self.burst_disc_rupture_pressure_bar,
            "enclosure_protection_state": self.enclosure_protection_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ArcQuenchRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS arc_quench_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    optical_fiber_arc_detected INTEGER DEFAULT 0,
                    pyrotechnic_igniter_health TEXT DEFAULT 'IGNITER_CIRCUIT_CONTINUITY_HEALTHY',
                    arc_quench_reaction_time_ms REAL DEFAULT 3.8,
                    burst_disc_rupture_pressure_bar REAL DEFAULT 12.0,
                    enclosure_protection_state TEXT DEFAULT 'ARC_FLASH_CONTAINMENT_ARMED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ArcQuenchNode:
        ArcQuenchRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM arc_quench_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["optical_fiber_arc_detected"] = bool(d["optical_fiber_arc_detected"])
                return ArcQuenchNode(**d)
            node = ArcQuenchNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO arc_quench_nodes (
                    id, unit_code, zone_id, floor_level,
                    optical_fiber_arc_detected,
                    pyrotechnic_igniter_health,
                    arc_quench_reaction_time_ms,
                    burst_disc_rupture_pressure_bar,
                    enclosure_protection_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                1 if node.optical_fiber_arc_detected else 0,
                node.pyrotechnic_igniter_health,
                node.arc_quench_reaction_time_ms,
                node.burst_disc_rupture_pressure_bar,
                node.enclosure_protection_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ArcQuenchRepository.init_table()
