"""
SmartPark Electrical Substation Transformer Dissolved Gas Analysis (DGA) Repository Layer
Manages mineral dielectric insulating oil gas chromatography sensors (H2, CH4, C2H4, C2H2 ppm), Duval triangle arcing analytics, and IEEE C57.104 health status.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class DGASensorNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "DGA-TRANSFORMER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation Transformer Vault 1",
        dissolved_hydrogen_h2_ppm: float = 14.5,   # IEEE C57.104 Condition 1 < 100 ppm
        dissolved_methane_ch4_ppm: float = 8.2,    # Limit < 120 ppm
        dissolved_acetylene_c2h2_ppm: float = 0.4, # Critical arcing indicator < 1.0 ppm
        total_combustible_gas_tcg_ppm: float = 38.0,
        transformer_oil_temp_celsius: float = 58.4,
        ieee_c57_condition: str = "IEEE_CONDITION_1_NORMAL_HEALTHY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"dga-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.dissolved_hydrogen_h2_ppm = dissolved_hydrogen_h2_ppm
        self.dissolved_methane_ch4_ppm = dissolved_methane_ch4_ppm
        self.dissolved_acetylene_c2h2_ppm = dissolved_acetylene_c2h2_ppm
        self.total_combustible_gas_tcg_ppm = total_combustible_gas_tcg_ppm
        self.transformer_oil_temp_celsius = transformer_oil_temp_celsius
        self.ieee_c57_condition = ieee_c57_condition
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "dissolved_hydrogen_h2_ppm": self.dissolved_hydrogen_h2_ppm,
            "dissolved_methane_ch4_ppm": self.dissolved_methane_ch4_ppm,
            "dissolved_acetylene_c2h2_ppm": self.dissolved_acetylene_c2h2_ppm,
            "total_combustible_gas_tcg_ppm": self.total_combustible_gas_tcg_ppm,
            "transformer_oil_temp_celsius": self.transformer_oil_temp_celsius,
            "ieee_c57_condition": self.ieee_c57_condition,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class DGASensorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS dga_sensor_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    dissolved_hydrogen_h2_ppm REAL DEFAULT 14.5,
                    dissolved_methane_ch4_ppm REAL DEFAULT 8.2,
                    dissolved_acetylene_c2h2_ppm REAL DEFAULT 0.4,
                    total_combustible_gas_tcg_ppm REAL DEFAULT 38.0,
                    transformer_oil_temp_celsius REAL DEFAULT 58.4,
                    ieee_c57_condition TEXT DEFAULT 'IEEE_CONDITION_1_NORMAL_HEALTHY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> DGASensorNode:
        DGASensorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM dga_sensor_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return DGASensorNode(**dict(row))
            node = DGASensorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO dga_sensor_nodes (
                    id, sensor_code, zone_id, floor_level,
                    dissolved_hydrogen_h2_ppm,
                    dissolved_methane_ch4_ppm,
                    dissolved_acetylene_c2h2_ppm,
                    total_combustible_gas_tcg_ppm,
                    transformer_oil_temp_celsius,
                    ieee_c57_condition, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.dissolved_hydrogen_h2_ppm,
                node.dissolved_methane_ch4_ppm,
                node.dissolved_acetylene_c2h2_ppm,
                node.total_combustible_gas_tcg_ppm,
                node.transformer_oil_temp_celsius,
                node.ieee_c57_condition, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

DGASensorRepository.init_table()
