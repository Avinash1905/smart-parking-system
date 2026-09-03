"""
SmartPark Electromagnetic Pulse Rebar Cover Depth & Concrete Durability Repository Layer
Manages electromagnetic pulse induction cover meters measuring concrete cover thickness (mm) over reinforcing rebar to ensure Eurocode 2 corrosion protection.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RebarDepthNode:
    def __init__(
        self,
        id: str = "",
        node_code: str = "REBAR-COVER-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Heavy Load Driving Lane",
        measured_cover_depth_mm: float = 48.5,  # Eurocode 2 minimum cover > 40.0 mm
        design_minimum_cover_mm: float = 40.0,
        rebar_diameter_nominal_mm: int = 25,
        electromagnetic_signal_strength_pct: float = 98.2,
        corrosion_durability_status: str = "EUROCODE_2_COVER_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rdn-{uuid.uuid4().hex[:8]}"
        self.node_code = node_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_cover_depth_mm = measured_cover_depth_mm
        self.design_minimum_cover_mm = design_minimum_cover_mm
        self.rebar_diameter_nominal_mm = rebar_diameter_nominal_mm
        self.electromagnetic_signal_strength_pct = electromagnetic_signal_strength_pct
        self.corrosion_durability_status = corrosion_durability_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "node_code": self.node_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_cover_depth_mm": self.measured_cover_depth_mm,
            "design_minimum_cover_mm": self.design_minimum_cover_mm,
            "rebar_diameter_nominal_mm": self.rebar_diameter_nominal_mm,
            "electromagnetic_signal_strength_pct": self.electromagnetic_signal_strength_pct,
            "corrosion_durability_status": self.corrosion_durability_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RebarDepthRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rebar_depth_nodes (
                    id TEXT PRIMARY KEY,
                    node_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_cover_depth_mm REAL DEFAULT 48.5,
                    design_minimum_cover_mm REAL DEFAULT 40.0,
                    rebar_diameter_nominal_mm INTEGER DEFAULT 25,
                    electromagnetic_signal_strength_pct REAL DEFAULT 98.2,
                    corrosion_durability_status TEXT DEFAULT 'EUROCODE_2_COVER_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RebarDepthNode:
        RebarDepthRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM rebar_depth_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return RebarDepthNode(**dict(row))
            node = RebarDepthNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO rebar_depth_nodes (
                    id, node_code, zone_id, floor_level,
                    measured_cover_depth_mm, design_minimum_cover_mm,
                    rebar_diameter_nominal_mm,
                    electromagnetic_signal_strength_pct,
                    corrosion_durability_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.node_code, node.zone_id, node.floor_level,
                node.measured_cover_depth_mm,
                node.design_minimum_cover_mm,
                node.rebar_diameter_nominal_mm,
                node.electromagnetic_signal_strength_pct,
                node.corrosion_durability_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

RebarDepthRepository.init_table()
