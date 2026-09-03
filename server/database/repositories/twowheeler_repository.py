"""
SmartPark Two-Wheeler & EV Motorcycle Stacking Dock Repository Layer
Manages high-density two-wheeler bays, swappable EV battery lockers, and micro-parking tariffs (₹5/hr).
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TwoWheelerBay:
    def __init__(
        self,
        id: str = "",
        bay_code: str = "2W-BAY-01",
        zone_id: str = "zone-pub-01",
        vehicle_type: str = "ELECTRIC_SCOOTER",  # MOTORCYCLE | ELECTRIC_SCOOTER | BICYCLE
        helmet_locker_code: str = "HL-402",
        swappable_battery_station_present: bool = True,
        rate_per_hour: float = 5.0,
        status: str = "AVAILABLE",  # AVAILABLE | OCCUPIED | RESERVED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"2w-{uuid.uuid4().hex[:8]}"
        self.bay_code = bay_code
        self.zone_id = zone_id
        self.vehicle_type = vehicle_type
        self.helmet_locker_code = helmet_locker_code
        self.swappable_battery_station_present = swappable_battery_station_present
        self.rate_per_hour = rate_per_hour
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "bay_code": self.bay_code,
            "zone_id": self.zone_id,
            "vehicle_type": self.vehicle_type,
            "helmet_locker_code": self.helmet_locker_code,
            "swappable_battery_station_present": self.swappable_battery_station_present,
            "rate_per_hour": self.rate_per_hour,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class TwoWheelerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS twowheeler_bays (
                    id TEXT PRIMARY KEY,
                    bay_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    vehicle_type TEXT DEFAULT 'ELECTRIC_SCOOTER',
                    helmet_locker_code TEXT NOT NULL,
                    swappable_battery_station_present INTEGER DEFAULT 1,
                    rate_per_hour REAL DEFAULT 5.0,
                    status TEXT DEFAULT 'AVAILABLE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_by_zone(zone_id: str = "zone-pub-01") -> List[TwoWheelerBay]:
        TwoWheelerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM twowheeler_bays WHERE zone_id = ? ORDER BY bay_code ASC", (zone_id,))
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["swappable_battery_station_present"] = bool(d["swappable_battery_station_present"])
                res.append(TwoWheelerBay(**d))
            return res

    @staticmethod
    def create(item: TwoWheelerBay) -> bool:
        TwoWheelerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO twowheeler_bays (
                    id, bay_code, zone_id, vehicle_type,
                    helmet_locker_code, swappable_battery_station_present,
                    rate_per_hour, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.bay_code, item.zone_id, item.vehicle_type,
                item.helmet_locker_code,
                1 if item.swappable_battery_station_present else 0,
                item.rate_per_hour, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

TwoWheelerRepository.init_table()
