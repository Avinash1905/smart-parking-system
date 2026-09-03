"""
SmartPark Substation SF6 Gas Insulated Switchgear (GIS) Leakage & Density Repository Layer
Manages sulfur hexafluoride (SF6) dielectric gas density sensors (bar absolute @ 20°C), infrared photoacoustic gas leak sniffers (ppm), and zero-greenhouse leak standards.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SF6SnifferNode:
    def __init__(
        self,
        id: str = "",
        compartment_code: str = "GIS-SF6-BREAKER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "High-Voltage Substation GIS Room",
        gas_density_pressure_bar_abs: float = 6.20,  # Minimum safe density > 5.50 bar
        ambient_sf6_ppm_leak: float = 0.0,           # Zero leak < 1.0 ppm
        temperature_compensated_celsius: float = 20.0,
        leak_rate_pct_per_year: float = 0.05,        # IEC 62271-203 limit < 0.5% / year
        dielectric_arc_quench_state: str = "DIELECTRIC_DENSITY_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"sf6-{uuid.uuid4().hex[:8]}"
        self.compartment_code = compartment_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.gas_density_pressure_bar_abs = gas_density_pressure_bar_abs
        self.ambient_sf6_ppm_leak = ambient_sf6_ppm_leak
        self.temperature_compensated_celsius = temperature_compensated_celsius
        self.leak_rate_pct_per_year = leak_rate_pct_per_year
        self.dielectric_arc_quench_state = dielectric_arc_quench_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "compartment_code": self.compartment_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "gas_density_pressure_bar_abs": self.gas_density_pressure_bar_abs,
            "ambient_sf6_ppm_leak": self.ambient_sf6_ppm_leak,
            "temperature_compensated_celsius": self.temperature_compensated_celsius,
            "leak_rate_pct_per_year": self.leak_rate_pct_per_year,
            "dielectric_arc_quench_state": self.dielectric_arc_quench_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SF6SnifferRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sf6_sniffer_nodes (
                    id TEXT PRIMARY KEY,
                    compartment_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    gas_density_pressure_bar_abs REAL DEFAULT 6.20,
                    ambient_sf6_ppm_leak REAL DEFAULT 0.0,
                    temperature_compensated_celsius REAL DEFAULT 20.0,
                    leak_rate_pct_per_year REAL DEFAULT 0.05,
                    dielectric_arc_quench_state TEXT DEFAULT 'DIELECTRIC_DENSITY_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SF6SnifferNode:
        SF6SnifferRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sf6_sniffer_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SF6SnifferNode(**dict(row))
            node = SF6SnifferNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO sf6_sniffer_nodes (
                    id, compartment_code, zone_id, floor_level,
                    gas_density_pressure_bar_abs, ambient_sf6_ppm_leak,
                    temperature_compensated_celsius,
                    leak_rate_pct_per_year,
                    dielectric_arc_quench_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.compartment_code, node.zone_id, node.floor_level,
                node.gas_density_pressure_bar_abs,
                node.ambient_sf6_ppm_leak,
                node.temperature_compensated_celsius,
                node.leak_rate_pct_per_year,
                node.dielectric_arc_quench_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SF6SnifferRepository.init_table()
