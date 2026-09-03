"""
SmartPark High-Bay Micro-Prismatic Daylight Solar Light Pipe Repository Layer
Manages 99.7% specular reflectivity optical tube solar light collectors, lux level photometers, DALI auto-dimming LED balance, and zero-carbon daytime illumination.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SolarLightpipeNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "LIGHTPIPE-OPTICAL-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Level 3 Upper Parking Deck",
        delivered_daylight_lux: float = 380.0,       # Recommended deck lighting 150-300 lux
        optical_tube_reflectivity_pct: float = 99.7,
        dali_led_dimming_level_pct: float = 15.0,    # LED dimmed by 85% due to natural sunlight
        energy_savings_kwh_daily: float = 42.5,
        lightpipe_system_state: str = "DAYLIGHT_HARVESTING_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"slp-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.delivered_daylight_lux = delivered_daylight_lux
        self.optical_tube_reflectivity_pct = optical_tube_reflectivity_pct
        self.dali_led_dimming_level_pct = dali_led_dimming_level_pct
        self.energy_savings_kwh_daily = energy_savings_kwh_daily
        self.lightpipe_system_state = lightpipe_system_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "delivered_daylight_lux": self.delivered_daylight_lux,
            "optical_tube_reflectivity_pct": self.optical_tube_reflectivity_pct,
            "dali_led_dimming_level_pct": self.dali_led_dimming_level_pct,
            "energy_savings_kwh_daily": self.energy_savings_kwh_daily,
            "lightpipe_system_state": self.lightpipe_system_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SolarLightpipeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS solar_lightpipe_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    delivered_daylight_lux REAL DEFAULT 380.0,
                    optical_tube_reflectivity_pct REAL DEFAULT 99.7,
                    dali_led_dimming_level_pct REAL DEFAULT 15.0,
                    energy_savings_kwh_daily REAL DEFAULT 42.5,
                    lightpipe_system_state TEXT DEFAULT 'DAYLIGHT_HARVESTING_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SolarLightpipeNode:
        SolarLightpipeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM solar_lightpipe_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SolarLightpipeNode(**dict(row))
            node = SolarLightpipeNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO solar_lightpipe_nodes (
                    id, unit_code, zone_id, floor_level,
                    delivered_daylight_lux,
                    optical_tube_reflectivity_pct,
                    dali_led_dimming_level_pct,
                    energy_savings_kwh_daily,
                    lightpipe_system_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.delivered_daylight_lux,
                node.optical_tube_reflectivity_pct,
                node.dali_led_dimming_level_pct,
                node.energy_savings_kwh_daily,
                node.lightpipe_system_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SolarLightpipeRepository.init_table()
