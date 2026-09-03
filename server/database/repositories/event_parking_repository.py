"""
SmartPark Special Event & Stadium Parking Repository Layer
Manages high-volume stadium parking passes, event-specific dynamic pricing, and express exit lanes.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SpecialEventParking:
    def __init__(
        self,
        id: str = "",
        event_name: str = "IPL T20 Cricket Match (Chinnaswamy Stadium)",
        venue_name: str = "M. Chinnaswamy Stadium, Cubbon Road",
        event_date: str = "Tonight, 07:00 PM",
        associated_zone_id: str = "zone-pub-01",
        fixed_event_tariff: float = 200.0,
        express_exit_lane_included: bool = True,
        available_event_passes: int = 45,
        status: str = "ACTIVE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"evt-{uuid.uuid4().hex[:8]}"
        self.event_name = event_name
        self.venue_name = venue_name
        self.event_date = event_date
        self.associated_zone_id = associated_zone_id
        self.fixed_event_tariff = fixed_event_tariff
        self.express_exit_lane_included = express_exit_lane_included
        self.available_event_passes = available_event_passes
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "event_name": self.event_name,
            "venue_name": self.venue_name,
            "event_date": self.event_date,
            "associated_zone_id": self.associated_zone_id,
            "fixed_event_tariff": self.fixed_event_tariff,
            "express_exit_lane_included": self.express_exit_lane_included,
            "available_event_passes": self.available_event_passes,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class EventParkingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS special_event_parking (
                    id TEXT PRIMARY KEY,
                    event_name TEXT NOT NULL,
                    venue_name TEXT NOT NULL,
                    event_date TEXT NOT NULL,
                    associated_zone_id TEXT NOT NULL,
                    fixed_event_tariff REAL DEFAULT 200.0,
                    express_exit_lane_included INTEGER DEFAULT 1,
                    available_event_passes INTEGER DEFAULT 45,
                    status TEXT DEFAULT 'ACTIVE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_active() -> List[SpecialEventParking]:
        EventParkingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM special_event_parking WHERE status = 'ACTIVE' ORDER BY created_at DESC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["express_exit_lane_included"] = bool(d["express_exit_lane_included"])
                res.append(SpecialEventParking(**d))
            return res

    @staticmethod
    def create(item: SpecialEventParking) -> bool:
        EventParkingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO special_event_parking (
                    id, event_name, venue_name, event_date,
                    associated_zone_id, fixed_event_tariff,
                    express_exit_lane_included, available_event_passes,
                    status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.event_name, item.venue_name, item.event_date,
                item.associated_zone_id, item.fixed_event_tariff,
                1 if item.express_exit_lane_included else 0,
                item.available_event_passes, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

EventParkingRepository.init_table()
