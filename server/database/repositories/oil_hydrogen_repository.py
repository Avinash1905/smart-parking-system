"""
SmartPark Substation Step-Down Transformer Dissolved Hydrogen (H2) Gas Sensor Repository Layer
Manages micro-machined palladium-nickel solid-state fuel cell hydrogen sensors, mineral dielectric oil DGA monitoring, and transformer winding insulation health.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class OilHydrogenNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "H2-DGA-TRANSFORMER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation 11kV/415V 2.5MVA Transformer Bay",
        measured_dissolved_h2_ppm: float = 18.4,   # Normal baseline < 100.0 ppm IEEE C57.104
        oil_temperature_celsius: float = 54.2,
        gas_generation_rate_ppm_day: float = 0.4,
        transformer_insulation_status: str = "INSULATION_HEALTHY_CONDITION_1",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ohn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_dissolved_h2_ppm = measured_dissolved_h2_ppm
        self.oil_temperature_celsius = oil_temperature_celsius
        self.gas_generation_rate_ppm_day = gas_generation_rate_ppm_day
        self.transformer_insulation_status = transformer_insulation_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_dissolved_h2_ppm": self.measured_dissolved_h2_ppm,
            "oil_temperature_celsius": self.oil_temperature_celsius,
            "gas_generation_rate_ppm_day": self.gas_generation_rate_ppm_day,
            "transformer_insulation_status": self.transformer_insulation_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class OilHydrogenRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS oil_hydrogen_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_dissolved_h2_ppm REAL DEFAULT 18.4,
                    oil_temperature_celsius REAL DEFAULT 54.2,
                    gas_generation_rate_ppm_day REAL DEFAULT 0.4,
                    transformer_insulation_status TEXT DEFAULT 'INSULATION_HEALTHY_CONDITION_1',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> OilHydrogenNode:
        OilHydrogenRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM oil_hydrogen_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return OilHydrogenNode(**dict(row))
            node = OilHydrogenNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO oil_hydrogen_nodes (
                    id, sensor_code, zone_id, floor_level,
                    measured_dissolved_h2_ppm,
                    oil_temperature_celsius,
                    gas_generation_rate_ppm_day,
                    transformer_insulation_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.measured_dissolved_h2_ppm,
                node.oil_temperature_celsius,
                node.gas_generation_rate_ppm_day,
                node.transformer_insulation_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

OilHydrogenRepository.init_table()
