"""
SmartPark Windshield Stone-Chip UV Resin Repair Kiosk Repository Layer
Manages optical acrylate UV resin injectors, vacuum/pressure crack cycling, and automated windshield bullseye chip restoration.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class StoneChipStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "STONE-CHIP-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Auto Glass Care Bay",
        optical_resin_cartridge_pct: float = 91.5,
        vacuum_pressure_bar: float = -0.85,
        uv_curing_wavelength_nm: int = 365,
        repairs_completed_today: int = 8,
        station_status: str = "INJECTOR_READY_FOR_USE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"scs-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.optical_resin_cartridge_pct = optical_resin_cartridge_pct
        self.vacuum_pressure_bar = vacuum_pressure_bar
        self.uv_curing_wavelength_nm = uv_curing_wavelength_nm
        self.repairs_completed_today = repairs_completed_today
        self.station_status = station_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "optical_resin_cartridge_pct": self.optical_resin_cartridge_pct,
            "vacuum_pressure_bar": self.vacuum_pressure_bar,
            "uv_curing_wavelength_nm": self.uv_curing_wavelength_nm,
            "repairs_completed_today": self.repairs_completed_today,
            "station_status": self.station_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class StoneChipRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS stone_chip_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    optical_resin_cartridge_pct REAL DEFAULT 91.5,
                    vacuum_pressure_bar REAL DEFAULT -0.85,
                    uv_curing_wavelength_nm INTEGER DEFAULT 365,
                    repairs_completed_today INTEGER DEFAULT 8,
                    station_status TEXT DEFAULT 'INJECTOR_READY_FOR_USE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> StoneChipStation:
        StoneChipRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM stone_chip_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return StoneChipStation(**dict(row))
            station = StoneChipStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO stone_chip_stations (
                    id, station_code, zone_id, floor_level,
                    optical_resin_cartridge_pct, vacuum_pressure_bar,
                    uv_curing_wavelength_nm, repairs_completed_today,
                    station_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level, station.optical_resin_cartridge_pct,
                station.vacuum_pressure_bar,
                station.uv_curing_wavelength_nm,
                station.repairs_completed_today,
                station.station_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

StoneChipRepository.init_table()
