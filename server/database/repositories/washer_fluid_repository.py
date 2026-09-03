"""
SmartPark Complimentary Windshield Washer Fluid Dispenser Repository Layer
Manages automated fluid top-up dispensers, flow meter milliliters dispensed, and de-bug / anti-freeze tank reserves.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class WasherFluidStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "WASHER-FLUID-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Driver Care Bay",
        fluid_tank_reserve_liters: float = 240.0,
        fluid_type: str = "ALL_SEASON_DE_BUG_RAIN_X",
        total_ml_dispensed_today: int = 14500,
        dispenser_status: str = "WAND_READY_TO_DISPENSE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"wfs-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.fluid_tank_reserve_liters = fluid_tank_reserve_liters
        self.fluid_type = fluid_type
        self.total_ml_dispensed_today = total_ml_dispensed_today
        self.dispenser_status = dispenser_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "fluid_tank_reserve_liters": self.fluid_tank_reserve_liters,
            "fluid_type": self.fluid_type,
            "total_ml_dispensed_today": self.total_ml_dispensed_today,
            "dispenser_status": self.dispenser_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class WasherFluidRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS washer_fluid_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    fluid_tank_reserve_liters REAL DEFAULT 240.0,
                    fluid_type TEXT DEFAULT 'ALL_SEASON_DE_BUG_RAIN_X',
                    total_ml_dispensed_today INTEGER DEFAULT 14500,
                    dispenser_status TEXT DEFAULT 'WAND_READY_TO_DISPENSE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> WasherFluidStation:
        WasherFluidRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM washer_fluid_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return WasherFluidStation(**dict(row))
            station = WasherFluidStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO washer_fluid_stations (
                    id, station_code, zone_id, floor_level,
                    fluid_tank_reserve_liters, fluid_type,
                    total_ml_dispensed_today, dispenser_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level,
                station.fluid_tank_reserve_liters, station.fluid_type,
                station.total_ml_dispensed_today,
                station.dispenser_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

WasherFluidRepository.init_table()
