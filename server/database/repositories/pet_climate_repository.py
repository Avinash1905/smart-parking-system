"""
SmartPark Pet-Friendly Parking Stall & Thermal Climate Guard Repository Layer
Manages designated shaded pet parking bays, interior cabin infrared thermography sensors (°C), and fresh chilled water hydration stations.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PetClimateStall:
    def __init__(
        self,
        id: str = "",
        stall_code: str = "PET-BAY-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 (Shaded Pet Zone)",
        interior_cabin_temp_celsius: float = 21.8,
        ambient_bay_temp_celsius: float = 22.0,
        misting_fan_active: bool = True,
        fresh_water_dispenser_liters: float = 48.0,
        pet_safety_status: str = "SAFE_COMFORT_CLIMATE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"pcs-{uuid.uuid4().hex[:8]}"
        self.stall_code = stall_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.interior_cabin_temp_celsius = interior_cabin_temp_celsius
        self.ambient_bay_temp_celsius = ambient_bay_temp_celsius
        self.misting_fan_active = misting_fan_active
        self.fresh_water_dispenser_liters = fresh_water_dispenser_liters
        self.pet_safety_status = pet_safety_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "stall_code": self.stall_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "interior_cabin_temp_celsius": self.interior_cabin_temp_celsius,
            "ambient_bay_temp_celsius": self.ambient_bay_temp_celsius,
            "misting_fan_active": self.misting_fan_active,
            "fresh_water_dispenser_liters": self.fresh_water_dispenser_liters,
            "pet_safety_status": self.pet_safety_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PetClimateRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS pet_climate_stalls (
                    id TEXT PRIMARY KEY,
                    stall_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    interior_cabin_temp_celsius REAL DEFAULT 21.8,
                    ambient_bay_temp_celsius REAL DEFAULT 22.0,
                    misting_fan_active INTEGER DEFAULT 1,
                    fresh_water_dispenser_liters REAL DEFAULT 48.0,
                    pet_safety_status TEXT DEFAULT 'SAFE_COMFORT_CLIMATE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> PetClimateStall:
        PetClimateRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM pet_climate_stalls WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["misting_fan_active"] = bool(d["misting_fan_active"])
                return PetClimateStall(**d)
            stall = PetClimateStall(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO pet_climate_stalls (
                    id, stall_code, zone_id, floor_level,
                    interior_cabin_temp_celsius, ambient_bay_temp_celsius,
                    misting_fan_active, fresh_water_dispenser_liters,
                    pet_safety_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                stall.id, stall.stall_code, stall.zone_id, stall.floor_level,
                stall.interior_cabin_temp_celsius,
                stall.ambient_bay_temp_celsius,
                1 if stall.misting_fan_active else 0,
                stall.fresh_water_dispenser_liters,
                stall.pet_safety_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return stall

PetClimateRepository.init_table()
