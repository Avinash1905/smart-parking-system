"""
SmartPark Deep Foundation Piezometric Water Table & Hydrostatic Uplift Repository Layer
Manages vibrating wire piezometers, sub-raft groundwater pressure (kPa), basement basement hydrostatic uplift safety factors, and buoyancy relief valves.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PiezometerBuoyancyNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "PIEZOMETER-VIBWIRE-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Basement B3 Raft Foundation Well",
        pore_water_pressure_kpa: float = 34.5,     # Allowable uplift pressure < 65.0 kPa
        water_table_depth_meters: float = 8.4,
        hydrostatic_uplift_factor_of_safety: float = 2.45,  # Design safety factor > 1.50
        buoyancy_relief_valve_status: str = "PRESSURE_RELIEF_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"pbn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.pore_water_pressure_kpa = pore_water_pressure_kpa
        self.water_table_depth_meters = water_table_depth_meters
        self.hydrostatic_uplift_factor_of_safety = hydrostatic_uplift_factor_of_safety
        self.buoyancy_relief_valve_status = buoyancy_relief_valve_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "pore_water_pressure_kpa": self.pore_water_pressure_kpa,
            "water_table_depth_meters": self.water_table_depth_meters,
            "hydrostatic_uplift_factor_of_safety": self.hydrostatic_uplift_factor_of_safety,
            "buoyancy_relief_valve_status": self.buoyancy_relief_valve_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PiezometerBuoyancyRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS piezometer_buoyancy_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    pore_water_pressure_kpa REAL DEFAULT 34.5,
                    water_table_depth_meters REAL DEFAULT 8.4,
                    hydrostatic_uplift_factor_of_safety REAL DEFAULT 2.45,
                    buoyancy_relief_valve_status TEXT DEFAULT 'PRESSURE_RELIEF_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> PiezometerBuoyancyNode:
        PiezometerBuoyancyRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM piezometer_buoyancy_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return PiezometerBuoyancyNode(**dict(row))
            node = PiezometerBuoyancyNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO piezometer_buoyancy_nodes (
                    id, sensor_code, zone_id, floor_level,
                    pore_water_pressure_kpa,
                    water_table_depth_meters,
                    hydrostatic_uplift_factor_of_safety,
                    buoyancy_relief_valve_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.pore_water_pressure_kpa,
                node.water_table_depth_meters,
                node.hydrostatic_uplift_factor_of_safety,
                node.buoyancy_relief_valve_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

PiezometerBuoyancyRepository.init_table()
