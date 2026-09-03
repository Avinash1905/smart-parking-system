"""
SmartPark Floor Epoxy Skid Resistance & Surface Friction Repository Layer
Monitors British Pendulum Number (BPN), dynamic friction coefficients, and slick floor hazards across multi-level decks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SkidResistanceNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "SKID-RAMP-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Ramp",
        surface_friction_bpn: float = 64.5,
        minimum_safe_bpn: float = 45.0,
        surface_condition: str = "DRY_HIGH_TRACTION",  # DRY_HIGH_TRACTION | WET_SAFE | SLICK_HAZARD_OIL
        micro_texture_depth_mm: float = 0.85,
        status: str = "SURFACE_SAFE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"skd-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.surface_friction_bpn = surface_friction_bpn
        self.minimum_safe_bpn = minimum_safe_bpn
        self.surface_condition = surface_condition
        self.micro_texture_depth_mm = micro_texture_depth_mm
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "surface_friction_bpn": self.surface_friction_bpn,
            "minimum_safe_bpn": self.minimum_safe_bpn,
            "surface_condition": self.surface_condition,
            "micro_texture_depth_mm": self.micro_texture_depth_mm,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SkidResistanceRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS skid_resistance_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    surface_friction_bpn REAL DEFAULT 64.5,
                    minimum_safe_bpn REAL DEFAULT 45.0,
                    surface_condition TEXT DEFAULT 'DRY_HIGH_TRACTION',
                    micro_texture_depth_mm REAL DEFAULT 0.85,
                    status TEXT DEFAULT 'SURFACE_SAFE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SkidResistanceNode:
        SkidResistanceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM skid_resistance_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SkidResistanceNode(**dict(row))
            node = SkidResistanceNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO skid_resistance_nodes (
                    id, sensor_code, zone_id, floor_level,
                    surface_friction_bpn, minimum_safe_bpn,
                    surface_condition, micro_texture_depth_mm,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.surface_friction_bpn, node.minimum_safe_bpn,
                node.surface_condition, node.micro_texture_depth_mm,
                node.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SkidResistanceRepository.init_table()
