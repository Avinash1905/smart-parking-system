"""
SmartPark High-Expansion Foam Fire Suppression Grid Repository Layer
Manages 1:500 high-expansion synthetic foam generators, deluge concentrate tanks, and NFPA 11 total flooding extinguishing systems for vehicle fuel fires.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FoamSuppressionNode:
    def __init__(
        self,
        id: str = "",
        generator_code: str = "FOAM-GEN-B2-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B2 (Fuel Risk Zone)",
        foam_expansion_ratio: str = "1:500_HIGH_EXPANSION",
        concentrate_tank_liters: int = 2500,
        deluge_water_pressure_bar: float = 8.5,
        fill_rate_cubic_meters_min: float = 120.0,
        suppression_readiness_state: str = "ARMED_NFPA_11_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"fom-{uuid.uuid4().hex[:8]}"
        self.generator_code = generator_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.foam_expansion_ratio = foam_expansion_ratio
        self.concentrate_tank_liters = concentrate_tank_liters
        self.deluge_water_pressure_bar = deluge_water_pressure_bar
        self.fill_rate_cubic_meters_min = fill_rate_cubic_meters_min
        self.suppression_readiness_state = suppression_readiness_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "generator_code": self.generator_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "foam_expansion_ratio": self.foam_expansion_ratio,
            "concentrate_tank_liters": self.concentrate_tank_liters,
            "deluge_water_pressure_bar": self.deluge_water_pressure_bar,
            "fill_rate_cubic_meters_min": self.fill_rate_cubic_meters_min,
            "suppression_readiness_state": self.suppression_readiness_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FoamSuppressionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS foam_suppression_nodes (
                    id TEXT PRIMARY KEY,
                    generator_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    foam_expansion_ratio TEXT DEFAULT '1:500_HIGH_EXPANSION',
                    concentrate_tank_liters INTEGER DEFAULT 2500,
                    deluge_water_pressure_bar REAL DEFAULT 8.5,
                    fill_rate_cubic_meters_min REAL DEFAULT 120.0,
                    suppression_readiness_state TEXT DEFAULT 'ARMED_NFPA_11_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> FoamSuppressionNode:
        FoamSuppressionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM foam_suppression_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return FoamSuppressionNode(**dict(row))
            node = FoamSuppressionNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO foam_suppression_nodes (
                    id, generator_code, zone_id, floor_level,
                    foam_expansion_ratio, concentrate_tank_liters,
                    deluge_water_pressure_bar,
                    fill_rate_cubic_meters_min,
                    suppression_readiness_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.generator_code, node.zone_id, node.floor_level,
                node.foam_expansion_ratio, node.concentrate_tank_liters,
                node.deluge_water_pressure_bar,
                node.fill_rate_cubic_meters_min,
                node.suppression_readiness_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

FoamSuppressionRepository.init_table()
