"""
SmartPark Helical Ramp Hydronic Radiant Heating & Anti-Ice Repository Layer
Manages embedded concrete thermal heat cables, sub-slab temperature sensors (°C), and automatic anti-freeze pavement de-icing.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RampHeatingNode:
    def __init__(
        self,
        id: str = "",
        grid_code: str = "HEAT-GRID-RAMP-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Exterior Entrance Helical Ramp",
        slab_temperature_celsius: float = 6.4,
        ambient_temperature_celsius: float = 4.2,
        embedded_cables_active: bool = False,
        heating_power_kw: float = 0.0,
        anti_freeze_system_status: str = "SURFACE_DRY_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rph-{uuid.uuid4().hex[:8]}"
        self.grid_code = grid_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.slab_temperature_celsius = slab_temperature_celsius
        self.ambient_temperature_celsius = ambient_temperature_celsius
        self.embedded_cables_active = embedded_cables_active
        self.heating_power_kw = heating_power_kw
        self.anti_freeze_system_status = anti_freeze_system_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "grid_code": self.grid_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "slab_temperature_celsius": self.slab_temperature_celsius,
            "ambient_temperature_celsius": self.ambient_temperature_celsius,
            "embedded_cables_active": self.embedded_cables_active,
            "heating_power_kw": self.heating_power_kw,
            "anti_freeze_system_status": self.anti_freeze_system_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RampHeatingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ramp_heating_nodes (
                    id TEXT PRIMARY KEY,
                    grid_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    slab_temperature_celsius REAL DEFAULT 6.4,
                    ambient_temperature_celsius REAL DEFAULT 4.2,
                    embedded_cables_active INTEGER DEFAULT 0,
                    heating_power_kw REAL DEFAULT 0.0,
                    anti_freeze_system_status TEXT DEFAULT 'SURFACE_DRY_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RampHeatingNode:
        RampHeatingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ramp_heating_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["embedded_cables_active"] = bool(d["embedded_cables_active"])
                return RampHeatingNode(**d)
            node = RampHeatingNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO ramp_heating_nodes (
                    id, grid_code, zone_id, floor_level,
                    slab_temperature_celsius, ambient_temperature_celsius,
                    embedded_cables_active, heating_power_kw,
                    anti_freeze_system_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.grid_code, node.zone_id, node.floor_level,
                node.slab_temperature_celsius,
                node.ambient_temperature_celsius,
                1 if node.embedded_cables_active else 0,
                node.heating_power_kw, node.anti_freeze_system_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

RampHeatingRepository.init_table()
