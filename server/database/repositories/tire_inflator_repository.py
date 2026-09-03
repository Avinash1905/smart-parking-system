"""
SmartPark Driver Tire Inflator & Air Station Dispenser Repository Layer
Manages complimentary digital tire inflator kiosks, nitrogen purge selections, and hose dispensing telemetry.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TireInflatorStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "AIR-STATION-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1",
        target_preset_psi: float = 33.0,
        nitrogen_purity_pct: float = 96.5,
        compressor_tank_psi: float = 120.0,
        complimentary_free_service: bool = True,
        status: str = "DISPENSER_READY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"air-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.target_preset_psi = target_preset_psi
        self.nitrogen_purity_pct = nitrogen_purity_pct
        self.compressor_tank_psi = compressor_tank_psi
        self.complimentary_free_service = complimentary_free_service
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "target_preset_psi": self.target_preset_psi,
            "nitrogen_purity_pct": self.nitrogen_purity_pct,
            "compressor_tank_psi": self.compressor_tank_psi,
            "complimentary_free_service": self.complimentary_free_service,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class TireInflatorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tire_inflator_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    target_preset_psi REAL DEFAULT 33.0,
                    nitrogen_purity_pct REAL DEFAULT 96.5,
                    compressor_tank_psi REAL DEFAULT 120.0,
                    complimentary_free_service INTEGER DEFAULT 1,
                    status TEXT DEFAULT 'DISPENSER_READY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> TireInflatorStation:
        TireInflatorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tire_inflator_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["complimentary_free_service"] = bool(d["complimentary_free_service"])
                return TireInflatorStation(**d)
            station = TireInflatorStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO tire_inflator_stations (
                    id, station_code, zone_id, floor_level,
                    target_preset_psi, nitrogen_purity_pct,
                    compressor_tank_psi, complimentary_free_service,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level, station.target_preset_psi,
                station.nitrogen_purity_pct,
                station.compressor_tank_psi,
                1 if station.complimentary_free_service else 0,
                station.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

TireInflatorRepository.init_table()
