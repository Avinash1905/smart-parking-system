"""
SmartPark DALI-2 Daylight Harvesting & Circadian Lighting Controller Repository Layer
Manages IEC 62386 DALI-2 addressable LED drivers, ambient photodiode lux harvesting sensors, and energy-saving daylight dimming across parking decks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class DALILightingNode:
    def __init__(
        self,
        id: str = "",
        controller_code: str = "DALI-CTRL-DECK-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor 2 Perimeter Daylit Bay",
        ambient_daylight_lux: float = 480.0,
        target_task_lux: float = 150.0,
        dimming_output_level_pct: float = 24.5,
        energy_savings_ratio_pct: float = 75.5,
        dali_bus_voltage_vdc: float = 16.2,
        lighting_state: str = "DAYLIGHT_HARVESTING_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"dli-{uuid.uuid4().hex[:8]}"
        self.controller_code = controller_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.ambient_daylight_lux = ambient_daylight_lux
        self.target_task_lux = target_task_lux
        self.dimming_output_level_pct = dimming_output_level_pct
        self.energy_savings_ratio_pct = energy_savings_ratio_pct
        self.dali_bus_voltage_vdc = dali_bus_voltage_vdc
        self.lighting_state = lighting_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "controller_code": self.controller_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "ambient_daylight_lux": self.ambient_daylight_lux,
            "target_task_lux": self.target_task_lux,
            "dimming_output_level_pct": self.dimming_output_level_pct,
            "energy_savings_ratio_pct": self.energy_savings_ratio_pct,
            "dali_bus_voltage_vdc": self.dali_bus_voltage_vdc,
            "lighting_state": self.lighting_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class DALILightingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS dali_lighting_nodes (
                    id TEXT PRIMARY KEY,
                    controller_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    ambient_daylight_lux REAL DEFAULT 480.0,
                    target_task_lux REAL DEFAULT 150.0,
                    dimming_output_level_pct REAL DEFAULT 24.5,
                    energy_savings_ratio_pct REAL DEFAULT 75.5,
                    dali_bus_voltage_vdc REAL DEFAULT 16.2,
                    lighting_state TEXT DEFAULT 'DAYLIGHT_HARVESTING_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> DALILightingNode:
        DALILightingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM dali_lighting_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return DALILightingNode(**dict(row))
            node = DALILightingNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO dali_lighting_nodes (
                    id, controller_code, zone_id, floor_level,
                    ambient_daylight_lux, target_task_lux,
                    dimming_output_level_pct,
                    energy_savings_ratio_pct, dali_bus_voltage_vdc,
                    lighting_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.controller_code, node.zone_id,
                node.floor_level, node.ambient_daylight_lux,
                node.target_task_lux, node.dimming_output_level_pct,
                node.energy_savings_ratio_pct,
                node.dali_bus_voltage_vdc, node.lighting_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

DALILightingRepository.init_table()
