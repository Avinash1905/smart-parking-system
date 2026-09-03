"""
SmartPark Under-Chassis EV Battery Direct-Piercing Water Lance Repository Layer
Manages pneumatic telescoping lance actuators, battery casing puncture nozzles, 300 LPM direct cell cooling, and runaway core thermal suppression.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class UnderchassisFloodNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "UNDERCHASSIS-LANCE-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 EV Fire Emergency Stall",
        pneumatic_pressure_bar: float = 8.5,
        water_injection_rate_lpm: float = 300.0,
        battery_case_pierce_readiness: str = "PIERCE_LANCE_ARMED",
        system_status: str = "DIRECT_COOLING_SYSTEM_READY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ufn-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.pneumatic_pressure_bar = pneumatic_pressure_bar
        self.water_injection_rate_lpm = water_injection_rate_lpm
        self.battery_case_pierce_readiness = battery_case_pierce_readiness
        self.system_status = system_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "pneumatic_pressure_bar": self.pneumatic_pressure_bar,
            "water_injection_rate_lpm": self.water_injection_rate_lpm,
            "battery_case_pierce_readiness": self.battery_case_pierce_readiness,
            "system_status": self.system_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class UnderchassisFloodRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS underchassis_flood_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    pneumatic_pressure_bar REAL DEFAULT 8.5,
                    water_injection_rate_lpm REAL DEFAULT 300.0,
                    battery_case_pierce_readiness TEXT DEFAULT 'PIERCE_LANCE_ARMED',
                    system_status TEXT DEFAULT 'DIRECT_COOLING_SYSTEM_READY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> UnderchassisFloodNode:
        UnderchassisFloodRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM underchassis_flood_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return UnderchassisFloodNode(**dict(row))
            node = UnderchassisFloodNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO underchassis_flood_nodes (
                    id, unit_code, zone_id, floor_level,
                    pneumatic_pressure_bar,
                    water_injection_rate_lpm,
                    battery_case_pierce_readiness,
                    system_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.pneumatic_pressure_bar,
                node.water_injection_rate_lpm,
                node.battery_case_pierce_readiness,
                node.system_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

UnderchassisFloodRepository.init_table()
