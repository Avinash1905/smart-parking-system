"""
SmartPark 4-Wheel Simultaneous Nitrogen Purge & Tire Balancer Repository Layer
Manages pressure swing adsorption (PSA) 99.5% pure nitrogen generators, automatic multi-tire balance valves, and moisture-free tire longevity.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class NitrogenPurgeStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "N2-PURGE-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Performance Tire Bay",
        nitrogen_purity_pct: float = 99.5,
        target_tire_psi: float = 34.0,
        four_wheel_manifold_connected: bool = True,
        moisture_dew_point_celsius: float = -45.0,
        cycles_performed_today: int = 19,
        purge_status: str = "SIMULTANEOUS_4_TIRE_BALANCED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"nps-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.nitrogen_purity_pct = nitrogen_purity_pct
        self.target_tire_psi = target_tire_psi
        self.four_wheel_manifold_connected = four_wheel_manifold_connected
        self.moisture_dew_point_celsius = moisture_dew_point_celsius
        self.cycles_performed_today = cycles_performed_today
        self.purge_status = purge_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "nitrogen_purity_pct": self.nitrogen_purity_pct,
            "target_tire_psi": self.target_tire_psi,
            "four_wheel_manifold_connected": self.four_wheel_manifold_connected,
            "moisture_dew_point_celsius": self.moisture_dew_point_celsius,
            "cycles_performed_today": self.cycles_performed_today,
            "purge_status": self.purge_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class NitrogenPurgeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS nitrogen_purge_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    nitrogen_purity_pct REAL DEFAULT 99.5,
                    target_tire_psi REAL DEFAULT 34.0,
                    four_wheel_manifold_connected INTEGER DEFAULT 1,
                    moisture_dew_point_celsius REAL DEFAULT -45.0,
                    cycles_performed_today INTEGER DEFAULT 19,
                    purge_status TEXT DEFAULT 'SIMULTANEOUS_4_TIRE_BALANCED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> NitrogenPurgeStation:
        NitrogenPurgeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM nitrogen_purge_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["four_wheel_manifold_connected"] = bool(d["four_wheel_manifold_connected"])
                return NitrogenPurgeStation(**d)
            station = NitrogenPurgeStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO nitrogen_purge_stations (
                    id, station_code, zone_id, floor_level,
                    nitrogen_purity_pct, target_tire_psi,
                    four_wheel_manifold_connected,
                    moisture_dew_point_celsius,
                    cycles_performed_today, purge_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level, station.nitrogen_purity_pct,
                station.target_tire_psi,
                1 if station.four_wheel_manifold_connected else 0,
                station.moisture_dew_point_celsius,
                station.cycles_performed_today, station.purge_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

NitrogenPurgeRepository.init_table()
