"""
SmartPark Fire Standpipe Automatic Air Release & Vacuum Relief Valve Repository Layer
Manages stainless-steel automatic air release valves (ARV), water hammer transient shock absorption, high-point trapped air venting, and NFPA 14 standpipe hydraulic surge protection.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class StandpipeAirPurgeNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "AIR-RELEASE-VALVE-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop High-Point Fire Standpipe Top",
        vented_air_volume_liters: float = 145.0,
        standpipe_line_pressure_bar: float = 12.8,
        surge_shock_attenuation_pct: float = 94.5,
        vacuum_breaker_seated: bool = True,
        air_valve_status: str = "VALVE_SEATED_PRESSURIZED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"arv-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.vented_air_volume_liters = vented_air_volume_liters
        self.standpipe_line_pressure_bar = standpipe_line_pressure_bar
        self.surge_shock_attenuation_pct = surge_shock_attenuation_pct
        self.vacuum_breaker_seated = vacuum_breaker_seated
        self.air_valve_status = air_valve_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "vented_air_volume_liters": self.vented_air_volume_liters,
            "standpipe_line_pressure_bar": self.standpipe_line_pressure_bar,
            "surge_shock_attenuation_pct": self.surge_shock_attenuation_pct,
            "vacuum_breaker_seated": self.vacuum_breaker_seated,
            "air_valve_status": self.air_valve_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class StandpipeAirPurgeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS standpipe_air_purge_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    vented_air_volume_liters REAL DEFAULT 145.0,
                    standpipe_line_pressure_bar REAL DEFAULT 12.8,
                    surge_shock_attenuation_pct REAL DEFAULT 94.5,
                    vacuum_breaker_seated INTEGER DEFAULT 1,
                    air_valve_status TEXT DEFAULT 'VALVE_SEATED_PRESSURIZED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> StandpipeAirPurgeNode:
        StandpipeAirPurgeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM standpipe_air_purge_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["vacuum_breaker_seated"] = bool(d["vacuum_breaker_seated"])
                return StandpipeAirPurgeNode(**d)
            node = StandpipeAirPurgeNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO standpipe_air_purge_nodes (
                    id, unit_code, zone_id, floor_level,
                    vented_air_volume_liters,
                    standpipe_line_pressure_bar,
                    surge_shock_attenuation_pct,
                    vacuum_breaker_seated,
                    air_valve_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.vented_air_volume_liters,
                node.standpipe_line_pressure_bar,
                node.surge_shock_attenuation_pct,
                1 if node.vacuum_breaker_seated else 0,
                node.air_valve_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

StandpipeAirPurgeRepository.init_table()
