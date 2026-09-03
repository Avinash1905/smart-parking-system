"""
SmartPark Campus Electric Shuttle & Micro-Mobility Repository Layer
Manages electric golf cart shuttles, campus e-scooters, and first-mile/last-mile transit connections.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CampusShuttleRoute:
    def __init__(
        self,
        id: str = "",
        shuttle_code: str = "SHUTTLE-E1",
        vehicle_type: str = "ELECTRIC_CAMPUS_BUS",
        route_name: str = "Think Campus Perimeter Express",
        current_stop: str = "Deck Alpha West Entrance",
        next_arrival_minutes: int = 3,
        frequency_minutes: int = 7,
        capacity_seats_open: int = 12,
        battery_pct: int = 91,
        status: str = "IN_SERVICE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"sht-{uuid.uuid4().hex[:8]}"
        self.shuttle_code = shuttle_code
        self.vehicle_type = vehicle_type
        self.route_name = route_name
        self.current_stop = current_stop
        self.next_arrival_minutes = next_arrival_minutes
        self.frequency_minutes = frequency_minutes
        self.capacity_seats_open = capacity_seats_open
        self.battery_pct = battery_pct
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "shuttle_code": self.shuttle_code,
            "vehicle_type": self.vehicle_type,
            "route_name": self.route_name,
            "current_stop": self.current_stop,
            "next_arrival_minutes": self.next_arrival_minutes,
            "frequency_minutes": self.frequency_minutes,
            "capacity_seats_open": self.capacity_seats_open,
            "battery_pct": self.battery_pct,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class ShuttleRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS campus_shuttles (
                    id TEXT PRIMARY KEY,
                    shuttle_code TEXT UNIQUE NOT NULL,
                    vehicle_type TEXT DEFAULT 'ELECTRIC_CAMPUS_BUS',
                    route_name TEXT NOT NULL,
                    current_stop TEXT NOT NULL,
                    next_arrival_minutes INTEGER DEFAULT 3,
                    frequency_minutes INTEGER DEFAULT 7,
                    capacity_seats_open INTEGER DEFAULT 12,
                    battery_pct INTEGER DEFAULT 91,
                    status TEXT DEFAULT 'IN_SERVICE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[CampusShuttleRoute]:
        ShuttleRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM campus_shuttles ORDER BY shuttle_code ASC")
            return [CampusShuttleRoute(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: CampusShuttleRoute) -> bool:
        ShuttleRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO campus_shuttles (
                    id, shuttle_code, vehicle_type, route_name,
                    current_stop, next_arrival_minutes, frequency_minutes,
                    capacity_seats_open, battery_pct, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.shuttle_code, item.vehicle_type, item.route_name,
                item.current_stop, item.next_arrival_minutes,
                item.frequency_minutes, item.capacity_seats_open,
                item.battery_pct, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

ShuttleRepository.init_table()
