"""
SmartPark Car Wash Reverse Osmosis (RO) & Water Reclamation Repository Layer
Manages high-pressure spot-free RO car wash bays, TDS mineral ppm meters, and closed-loop wastewater recycling tanks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CarwashROStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "RO-WASH-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Wash Bay",
        pure_water_tds_ppm: float = 12.4,  # Spot-free rinse TDS < 20 ppm
        water_recovery_rate_pct: float = 85.0,
        high_pressure_pump_bar: float = 95.0,
        recycled_water_tank_liters: int = 12500,
        status: str = "SPOT_FREE_RINSE_READY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"cro-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.pure_water_tds_ppm = pure_water_tds_ppm
        self.water_recovery_rate_pct = water_recovery_rate_pct
        self.high_pressure_pump_bar = high_pressure_pump_bar
        self.recycled_water_tank_liters = recycled_water_tank_liters
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "pure_water_tds_ppm": self.pure_water_tds_ppm,
            "water_recovery_rate_pct": self.water_recovery_rate_pct,
            "high_pressure_pump_bar": self.high_pressure_pump_bar,
            "recycled_water_tank_liters": self.recycled_water_tank_liters,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CarwashRORepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS carwash_ro_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    pure_water_tds_ppm REAL DEFAULT 12.4,
                    water_recovery_rate_pct REAL DEFAULT 85.0,
                    high_pressure_pump_bar REAL DEFAULT 95.0,
                    recycled_water_tank_liters INTEGER DEFAULT 12500,
                    status TEXT DEFAULT 'SPOT_FREE_RINSE_READY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> CarwashROStation:
        CarwashRORepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM carwash_ro_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return CarwashROStation(**dict(row))
            station = CarwashROStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO carwash_ro_stations (
                    id, station_code, zone_id, floor_level,
                    pure_water_tds_ppm, water_recovery_rate_pct,
                    high_pressure_pump_bar, recycled_water_tank_liters,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level, station.pure_water_tds_ppm,
                station.water_recovery_rate_pct,
                station.high_pressure_pump_bar,
                station.recycled_water_tank_liters,
                station.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

CarwashRORepository.init_table()
