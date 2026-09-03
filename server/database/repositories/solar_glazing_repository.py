"""
SmartPark Solar Low-E Glazing & Thermal Heat Gain Repository Layer
Manages facade solar heat gain coefficients (SHGC), infrared thermal insulation (U-factor), and visible light transmittance (VLT%) in parking atrium glazed cores.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SolarGlazingNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "GLAZING-OPTICAL-ATRIUM-01",
        zone_id: str = "zone-pub-01",
        location_label: str = "Atrium Elevator Glazed Curtainwall",
        solar_heat_gain_coefficient_shgc: float = 0.28,
        thermal_u_factor_w_m2k: float = 1.15,
        visible_light_transmittance_pct: float = 62.4,
        interior_solar_heat_rejected_pct: float = 72.0,
        thermal_insulation_status: str = "PASSIVE_COOLING_OPTIMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"glz-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.location_label = location_label
        self.solar_heat_gain_coefficient_shgc = solar_heat_gain_coefficient_shgc
        self.thermal_u_factor_w_m2k = thermal_u_factor_w_m2k
        self.visible_light_transmittance_pct = visible_light_transmittance_pct
        self.interior_solar_heat_rejected_pct = interior_solar_heat_rejected_pct
        self.thermal_insulation_status = thermal_insulation_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "location_label": self.location_label,
            "solar_heat_gain_coefficient_shgc": self.solar_heat_gain_coefficient_shgc,
            "thermal_u_factor_w_m2k": self.thermal_u_factor_w_m2k,
            "visible_light_transmittance_pct": self.visible_light_transmittance_pct,
            "interior_solar_heat_rejected_pct": self.interior_solar_heat_rejected_pct,
            "thermal_insulation_status": self.thermal_insulation_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SolarGlazingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS solar_glazing_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    location_label TEXT NOT NULL,
                    solar_heat_gain_coefficient_shgc REAL DEFAULT 0.28,
                    thermal_u_factor_w_m2k REAL DEFAULT 1.15,
                    visible_light_transmittance_pct REAL DEFAULT 62.4,
                    interior_solar_heat_rejected_pct REAL DEFAULT 72.0,
                    thermal_insulation_status TEXT DEFAULT 'PASSIVE_COOLING_OPTIMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SolarGlazingNode:
        SolarGlazingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM solar_glazing_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SolarGlazingNode(**dict(row))
            node = SolarGlazingNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO solar_glazing_nodes (
                    id, sensor_code, zone_id, location_label,
                    solar_heat_gain_coefficient_shgc, thermal_u_factor_w_m2k,
                    visible_light_transmittance_pct,
                    interior_solar_heat_rejected_pct,
                    thermal_insulation_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.location_label,
                node.solar_heat_gain_coefficient_shgc,
                node.thermal_u_factor_w_m2k,
                node.visible_light_transmittance_pct,
                node.interior_solar_heat_rejected_pct,
                node.thermal_insulation_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SolarGlazingRepository.init_table()
