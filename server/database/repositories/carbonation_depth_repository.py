"""
SmartPark Reinforced Concrete Carbonation Front & Rebar Passivation Depth Repository Layer
Manages embedded solid-state multi-depth pH electrodes, concrete carbonation front migration, rebar alkaline passivation layer, and corrosion protection.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CarbonationDepthNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "CARBONATION-PH-SENSOR-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Basement B2 Sub-Grade Concrete Columns",
        concrete_cover_depth_mm: float = 45.0,
        measured_carbonation_depth_mm: float = 12.4,  # Rebar cover safe until > 40 mm
        pore_solution_ph: float = 12.8,               # Uncarbonated concrete pH > 12.5
        rebar_passivation_state: str = "ALKALINE_PASSIVATION_INTACT",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"cdn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.concrete_cover_depth_mm = concrete_cover_depth_mm
        self.measured_carbonation_depth_mm = measured_carbonation_depth_mm
        self.pore_solution_ph = pore_solution_ph
        self.rebar_passivation_state = rebar_passivation_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "concrete_cover_depth_mm": self.concrete_cover_depth_mm,
            "measured_carbonation_depth_mm": self.measured_carbonation_depth_mm,
            "pore_solution_ph": self.pore_solution_ph,
            "rebar_passivation_state": self.rebar_passivation_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CarbonationDepthRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS carbonation_depth_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    concrete_cover_depth_mm REAL DEFAULT 45.0,
                    measured_carbonation_depth_mm REAL DEFAULT 12.4,
                    pore_solution_ph REAL DEFAULT 12.8,
                    rebar_passivation_state TEXT DEFAULT 'ALKALINE_PASSIVATION_INTACT',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> CarbonationDepthNode:
        CarbonationDepthRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM carbonation_depth_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return CarbonationDepthNode(**dict(row))
            node = CarbonationDepthNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO carbonation_depth_nodes (
                    id, sensor_code, zone_id, floor_level,
                    concrete_cover_depth_mm,
                    measured_carbonation_depth_mm,
                    pore_solution_ph, rebar_passivation_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.concrete_cover_depth_mm,
                node.measured_carbonation_depth_mm,
                node.pore_solution_ph,
                node.rebar_passivation_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

CarbonationDepthRepository.init_table()
