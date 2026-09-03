"""
SmartPark Driver Carpooling & High-Occupancy Vehicle (HOV) Repository Layer
Manages verified corporate carpool pairs, reserved prime entrance stalls, and rider split tariffs.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CarpoolRide:
    def __init__(
        self,
        id: str = "",
        driver_user_id: str = "",
        driver_name: str = "Avinash Sharma",
        co_riders: Optional[List[str]] = None,
        origin_area: str = "HSR Layout Sector 1",
        destination_zone_id: str = "zone-pvt-01",
        destination_zone_name: str = "TCS Corporate Parking Deck Alpha",
        assigned_hov_slot: str = "HOV-PRIME-01",
        carpool_discount_pct: float = 50.0,
        status: str = "ACTIVE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"cpool-{uuid.uuid4().hex[:8]}"
        self.driver_user_id = driver_user_id
        self.driver_name = driver_name
        self.co_riders = co_riders or ["Neha V. (Infosys)", "Suresh M. (TCS)"]
        self.origin_area = origin_area
        self.destination_zone_id = destination_zone_id
        self.destination_zone_name = destination_zone_name
        self.assigned_hov_slot = assigned_hov_slot
        self.carpool_discount_pct = carpool_discount_pct
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "driver_user_id": self.driver_user_id,
            "driver_name": self.driver_name,
            "co_riders": self.co_riders,
            "origin_area": self.origin_area,
            "destination_zone_id": self.destination_zone_id,
            "destination_zone_name": self.destination_zone_name,
            "assigned_hov_slot": self.assigned_hov_slot,
            "carpool_discount_pct": self.carpool_discount_pct,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class CarpoolRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS carpool_rides (
                    id TEXT PRIMARY KEY,
                    driver_user_id TEXT NOT NULL,
                    driver_name TEXT NOT NULL,
                    co_riders TEXT,
                    origin_area TEXT NOT NULL,
                    destination_zone_id TEXT NOT NULL,
                    destination_zone_name TEXT NOT NULL,
                    assigned_hov_slot TEXT NOT NULL,
                    carpool_discount_pct REAL DEFAULT 50.0,
                    status TEXT DEFAULT 'ACTIVE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(c: CarpoolRide) -> bool:
        CarpoolRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO carpool_rides (
                    id, driver_user_id, driver_name, co_riders,
                    origin_area, destination_zone_id, destination_zone_name,
                    assigned_hov_slot, carpool_discount_pct, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                c.id, c.driver_user_id, c.driver_name, json.dumps(c.co_riders),
                c.origin_area, c.destination_zone_id, c.destination_zone_name,
                c.assigned_hov_slot, c.carpool_discount_pct, c.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

CarpoolRepository.init_table()
