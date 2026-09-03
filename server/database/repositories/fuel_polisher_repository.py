"""
SmartPark Emergency Generator Diesel Fuel Polisher Repository Layer
Manages automated fuel filtration centrifuges, water coalescers, and ISO 4406 particulate cleanliness for 500kVA emergency generators.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FuelPolisherUnit:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "POLISHER-DIESEL-500KVA-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation Generator Vault",
        fuel_tank_capacity_liters: float = 5000.0,
        current_fuel_level_liters: float = 4650.0,
        iso_4406_cleanliness_code: str = "14/12/9_PRISTINE",
        water_separated_ppm: float = 24.0,  # ASTM D975 < 200 ppm
        polishing_flow_rate_lph: float = 600.0,
        operational_state: str = "AUTOMATIC_RECIRCULATION_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"fpu-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.fuel_tank_capacity_liters = fuel_tank_capacity_liters
        self.current_fuel_level_liters = current_fuel_level_liters
        self.iso_4406_cleanliness_code = iso_4406_cleanliness_code
        self.water_separated_ppm = water_separated_ppm
        self.polishing_flow_rate_lph = polishing_flow_rate_lph
        self.operational_state = operational_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "fuel_tank_capacity_liters": self.fuel_tank_capacity_liters,
            "current_fuel_level_liters": self.current_fuel_level_liters,
            "iso_4406_cleanliness_code": self.iso_4406_cleanliness_code,
            "water_separated_ppm": self.water_separated_ppm,
            "polishing_flow_rate_lph": self.polishing_flow_rate_lph,
            "operational_state": self.operational_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FuelPolisherRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS fuel_polisher_units (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    fuel_tank_capacity_liters REAL DEFAULT 5000.0,
                    current_fuel_level_liters REAL DEFAULT 4650.0,
                    iso_4406_cleanliness_code TEXT DEFAULT '14/12/9_PRISTINE',
                    water_separated_ppm REAL DEFAULT 24.0,
                    polishing_flow_rate_lph REAL DEFAULT 600.0,
                    operational_state TEXT DEFAULT 'AUTOMATIC_RECIRCULATION_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> FuelPolisherUnit:
        FuelPolisherRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM fuel_polisher_units WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return FuelPolisherUnit(**dict(row))
            unit = FuelPolisherUnit(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO fuel_polisher_units (
                    id, unit_code, zone_id, floor_level,
                    fuel_tank_capacity_liters, current_fuel_level_liters,
                    iso_4406_cleanliness_code, water_separated_ppm,
                    polishing_flow_rate_lph, operational_state,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                unit.id, unit.unit_code, unit.zone_id, unit.floor_level,
                unit.fuel_tank_capacity_liters,
                unit.current_fuel_level_liters,
                unit.iso_4406_cleanliness_code, unit.water_separated_ppm,
                unit.polishing_flow_rate_lph, unit.operational_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return unit

FuelPolisherRepository.init_table()
