"""
SmartPark Diesel Particulate Filter (DPF) Soot Regenerator Repository Layer
Manages silicon carbide diesel particulate filter matrix backpressure (kPa), active electric heater regeneration (600°C), and zero-soot clean emergency power generator exhaust.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class DPFRegeneratorNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "DPF-CLEANER-GEN-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Generator Exhaust Silencer Stack",
        dpf_differential_pressure_kpa: float = 4.2,  # Regen required if > 15.0 kPa
        filter_core_temp_celsius: float = 580.0,
        soot_mass_load_grams: float = 12.5,
        particulate_capture_efficiency_pct: float = 99.8,
        regeneration_cycle_state: str = "PASSIVE_CONTINUOUS_CLEAN",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"dpf-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.dpf_differential_pressure_kpa = dpf_differential_pressure_kpa
        self.filter_core_temp_celsius = filter_core_temp_celsius
        self.soot_mass_load_grams = soot_mass_load_grams
        self.particulate_capture_efficiency_pct = particulate_capture_efficiency_pct
        self.regeneration_cycle_state = regeneration_cycle_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "dpf_differential_pressure_kpa": self.dpf_differential_pressure_kpa,
            "filter_core_temp_celsius": self.filter_core_temp_celsius,
            "soot_mass_load_grams": self.soot_mass_load_grams,
            "particulate_capture_efficiency_pct": self.particulate_capture_efficiency_pct,
            "regeneration_cycle_state": self.regeneration_cycle_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class DPFRegeneratorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS dpf_regenerator_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    dpf_differential_pressure_kpa REAL DEFAULT 4.2,
                    filter_core_temp_celsius REAL DEFAULT 580.0,
                    soot_mass_load_grams REAL DEFAULT 12.5,
                    particulate_capture_efficiency_pct REAL DEFAULT 99.8,
                    regeneration_cycle_state TEXT DEFAULT 'PASSIVE_CONTINUOUS_CLEAN',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> DPFRegeneratorNode:
        DPFRegeneratorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM dpf_regenerator_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return DPFRegeneratorNode(**dict(row))
            node = DPFRegeneratorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO dpf_regenerator_nodes (
                    id, unit_code, zone_id, floor_level,
                    dpf_differential_pressure_kpa,
                    filter_core_temp_celsius, soot_mass_load_grams,
                    particulate_capture_efficiency_pct,
                    regeneration_cycle_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.dpf_differential_pressure_kpa,
                node.filter_core_temp_celsius, node.soot_mass_load_grams,
                node.particulate_capture_efficiency_pct,
                node.regeneration_cycle_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

DPFRegeneratorRepository.init_table()
