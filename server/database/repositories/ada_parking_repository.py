"""
SmartPark Accessible (ADA / Wheelchair) Reserved Bay Repository Layer
Manages extra-wide van accessible stalls, step-free tactile elevator routes, and verified disability parking permits.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ADAParkingBay:
    def __init__(
        self,
        id: str = "",
        slot_code: str = "ADA-G-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor G (Main Level)",
        aisle_width_meters: float = 3.8,
        distance_to_elevator_meters: int = 12,
        tactile_paving_present: bool = True,
        ev_wheelchair_ramp_access: bool = True,
        status: str = "AVAILABLE",  # AVAILABLE | OCCUPIED | RESERVED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"ada-{uuid.uuid4().hex[:8]}"
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.aisle_width_meters = aisle_width_meters
        self.distance_to_elevator_meters = distance_to_elevator_meters
        self.tactile_paving_present = tactile_paving_present
        self.ev_wheelchair_ramp_access = ev_wheelchair_ramp_access
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "aisle_width_meters": self.aisle_width_meters,
            "distance_to_elevator_meters": self.distance_to_elevator_meters,
            "tactile_paving_present": self.tactile_paving_present,
            "ev_wheelchair_ramp_access": self.ev_wheelchair_ramp_access,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class ADAParkingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ada_parking_bays (
                    id TEXT PRIMARY KEY,
                    slot_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    aisle_width_meters REAL DEFAULT 3.8,
                    distance_to_elevator_meters INTEGER DEFAULT 12,
                    tactile_paving_present INTEGER DEFAULT 1,
                    ev_wheelchair_ramp_access INTEGER DEFAULT 1,
                    status TEXT DEFAULT 'AVAILABLE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_by_zone(zone_id: str = "zone-pub-01") -> List[ADAParkingBay]:
        ADAParkingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ada_parking_bays WHERE zone_id = ? ORDER BY slot_code ASC", (zone_id,))
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["tactile_paving_present"] = bool(d["tactile_paving_present"])
                d["ev_wheelchair_ramp_access"] = bool(d["ev_wheelchair_ramp_access"])
                res.append(ADAParkingBay(**d))
            return res

    @staticmethod
    def create(item: ADAParkingBay) -> bool:
        ADAParkingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO ada_parking_bays (
                    id, slot_code, zone_id, floor_level,
                    aisle_width_meters, distance_to_elevator_meters,
                    tactile_paving_present, ev_wheelchair_ramp_access,
                    status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.slot_code, item.zone_id, item.floor_level,
                item.aisle_width_meters, item.distance_to_elevator_meters,
                1 if item.tactile_paving_present else 0,
                1 if item.ev_wheelchair_ramp_access else 0,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

ADAParkingRepository.init_table()
