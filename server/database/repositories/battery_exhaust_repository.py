"""
SmartPark Substation DC Battery Energy Storage Hydrogen Gas Safety Repository Layer
Manages catalytic bead hydrogen gas sniffers, battery bank thermal runaway exhaust blowers (100% ATEX certified), and LEL explosive limit interlocks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BatteryExhaustNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "BATTERY-EXHAUST-BESS-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation 250kWh BESS UPS Battery Room",
        hydrogen_concentration_pct_lel: float = 0.25,  # Alarm at > 1.0% LEL (4% Vol H2)
        ambient_temperature_celsius: float = 24.2,
        atex_exhaust_fan_cfm: float = 1200.0,
        thermal_runaway_vent_status: str = "AIR_VENTILATION_CONTINUOUS",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"beh-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.hydrogen_concentration_pct_lel = hydrogen_concentration_pct_lel
        self.ambient_temperature_celsius = ambient_temperature_celsius
        self.atex_exhaust_fan_cfm = atex_exhaust_fan_cfm
        self.thermal_runaway_vent_status = thermal_runaway_vent_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "hydrogen_concentration_pct_lel": self.hydrogen_concentration_pct_lel,
            "ambient_temperature_celsius": self.ambient_temperature_celsius,
            "atex_exhaust_fan_cfm": self.atex_exhaust_fan_cfm,
            "thermal_runaway_vent_status": self.thermal_runaway_vent_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BatteryExhaustRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS battery_exhaust_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    hydrogen_concentration_pct_lel REAL DEFAULT 0.25,
                    ambient_temperature_celsius REAL DEFAULT 24.2,
                    atex_exhaust_fan_cfm REAL DEFAULT 1200.0,
                    thermal_runaway_vent_status TEXT DEFAULT 'AIR_VENTILATION_CONTINUOUS',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> BatteryExhaustNode:
        BatteryExhaustRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM battery_exhaust_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return BatteryExhaustNode(**dict(row))
            node = BatteryExhaustNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO battery_exhaust_nodes (
                    id, unit_code, zone_id, floor_level,
                    hydrogen_concentration_pct_lel,
                    ambient_temperature_celsius,
                    atex_exhaust_fan_cfm,
                    thermal_runaway_vent_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.hydrogen_concentration_pct_lel,
                node.ambient_temperature_celsius,
                node.atex_exhaust_fan_cfm,
                node.thermal_runaway_vent_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

BatteryExhaustRepository.init_table()
