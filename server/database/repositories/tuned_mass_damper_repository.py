"""
SmartPark Structural Tuned Mass Damper (TMD) Vibration Absorber Repository Layer
Manages 20-ton pendular tuned mass dampers, hydraulic damping cylinders, structural sway attenuation, and seismic resonance suppression.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TunedMassDamperNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "TMD-SEISMIC-ABSORBER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop TMD Suspension Vault",
        pendulum_mass_tonnes: float = 20.0,
        natural_frequency_tuning_hz: float = 0.85,
        measured_deck_sway_amplitude_mm: float = 2.8,  # Allowable sway < 15.0 mm
        damping_efficiency_ratio_pct: float = 94.2,
        damper_operational_state: str = "TMD_ATTENUATION_ARMED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"tmd-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.pendulum_mass_tonnes = pendulum_mass_tonnes
        self.natural_frequency_tuning_hz = natural_frequency_tuning_hz
        self.measured_deck_sway_amplitude_mm = measured_deck_sway_amplitude_mm
        self.damping_efficiency_ratio_pct = damping_efficiency_ratio_pct
        self.damper_operational_state = damper_operational_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "pendulum_mass_tonnes": self.pendulum_mass_tonnes,
            "natural_frequency_tuning_hz": self.natural_frequency_tuning_hz,
            "measured_deck_sway_amplitude_mm": self.measured_deck_sway_amplitude_mm,
            "damping_efficiency_ratio_pct": self.damping_efficiency_ratio_pct,
            "damper_operational_state": self.damper_operational_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class TunedMassDamperRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tuned_mass_damper_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    pendulum_mass_tonnes REAL DEFAULT 20.0,
                    natural_frequency_tuning_hz REAL DEFAULT 0.85,
                    measured_deck_sway_amplitude_mm REAL DEFAULT 2.8,
                    damping_efficiency_ratio_pct REAL DEFAULT 94.2,
                    damper_operational_state TEXT DEFAULT 'TMD_ATTENUATION_ARMED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> TunedMassDamperNode:
        TunedMassDamperRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tuned_mass_damper_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return TunedMassDamperNode(**dict(row))
            node = TunedMassDamperNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO tuned_mass_damper_nodes (
                    id, unit_code, zone_id, floor_level,
                    pendulum_mass_tonnes, natural_frequency_tuning_hz,
                    measured_deck_sway_amplitude_mm,
                    damping_efficiency_ratio_pct,
                    damper_operational_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.pendulum_mass_tonnes, node.natural_frequency_tuning_hz,
                node.measured_deck_sway_amplitude_mm,
                node.damping_efficiency_ratio_pct,
                node.damper_operational_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

TunedMassDamperRepository.init_table()
