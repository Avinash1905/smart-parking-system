"""
SmartPark Multi-Stop Trip Planner Repository Layer
Manages saved trip itineraries with sequential parking spot reservations along planned driving routes.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TripItinerary:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        title: str = "Central Business District Trip",
        total_stops: int = 2,
        stops_payload: Optional[List[Dict[str, Any]]] = None,
        estimated_duration_hours: float = 4.0,
        status: str = "PLANNED",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"trip-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.title = title
        self.total_stops = total_stops
        self.stops_payload = stops_payload or []
        self.estimated_duration_hours = estimated_duration_hours
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "total_stops": self.total_stops,
            "stops": self.stops_payload,
            "estimated_duration_hours": self.estimated_duration_hours,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class TripRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS trip_itineraries (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    total_stops INTEGER DEFAULT 2,
                    stops_payload TEXT,
                    estimated_duration_hours REAL DEFAULT 4.0,
                    status TEXT DEFAULT 'PLANNED',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(t: TripItinerary) -> bool:
        TripRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO trip_itineraries (
                    id, user_id, title, total_stops, stops_payload,
                    estimated_duration_hours, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                t.id, t.user_id, t.title, t.total_stops,
                json.dumps(t.stops_payload), t.estimated_duration_hours,
                t.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_by_user(user_id: str) -> List[TripItinerary]:
        TripRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM trip_itineraries WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            trips = []
            for row in cursor.fetchall():
                d = dict(row)
                d["stops_payload"] = json.loads(d["stops_payload"] or "[]")
                trips.append(TripItinerary(**d))
            return trips

TripRepository.init_table()
