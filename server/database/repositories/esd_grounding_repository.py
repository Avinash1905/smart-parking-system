"""
SmartPark Anti-Static ESD Grounding & Dissipation Repository Layer
Manages electrostatic discharge surface resistivity (10^6 - 10^9 ohms/sq), copper grounding mesh continuity, and spark prevention in fueling/EV zones.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ESDGroundingNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "ESD-MESH-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 (EV Fast Charge Zone)",
        surface_resistivity_ohms_sq: float = 4.2e6,  # 4.2 x 10^6 ohms/sq (Dissipative range)
        ground_path_resistance_ohms: float = 0.85,  # Earth bond < 1.0 ohm
        copper_grid_continuity: bool = True,
        static_spark_risk_tier: str = "STATIC_SAFE_DISSIPATIVE",
        status: str = "GROUNDING_BONDED_VERIFIED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"esd-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.surface_resistivity_ohms_sq = surface_resistivity_ohms_sq
        self.ground_path_resistance_ohms = ground_path_resistance_ohms
        self.copper_grid_continuity = copper_grid_continuity
        self.static_spark_risk_tier = static_spark_risk_tier
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "surface_resistivity_ohms_sq": self.surface_resistivity_ohms_sq,
            "ground_path_resistance_ohms": self.ground_path_resistance_ohms,
            "copper_grid_continuity": self.copper_grid_continuity,
            "static_spark_risk_tier": self.static_spark_risk_tier,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ESDGroundingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS esd_grounding_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    surface_resistivity_ohms_sq REAL DEFAULT 4200000.0,
                    ground_path_resistance_ohms REAL DEFAULT 0.85,
                    copper_grid_continuity INTEGER DEFAULT 1,
                    static_spark_risk_tier TEXT DEFAULT 'STATIC_SAFE_DISSIPATIVE',
                    status TEXT DEFAULT 'GROUNDING_BONDED_VERIFIED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ESDGroundingNode:
        ESDGroundingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM esd_grounding_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["copper_grid_continuity"] = bool(d["copper_grid_continuity"])
                return ESDGroundingNode(**d)
            node = ESDGroundingNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO esd_grounding_nodes (
                    id, sensor_code, zone_id, floor_level,
                    surface_resistivity_ohms_sq, ground_path_resistance_ohms,
                    copper_grid_continuity, static_spark_risk_tier,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.surface_resistivity_ohms_sq,
                node.ground_path_resistance_ohms,
                1 if node.copper_grid_continuity else 0,
                node.static_spark_risk_tier, node.status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ESDGroundingRepository.init_table()
