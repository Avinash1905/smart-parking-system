"""
SmartPark Patrol Officer & Enforcement Dispatch Repository Layer
Manages municipal traffic warden beats, handheld citation terminals, and live GPS dispatch assignments.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PatrolOfficer:
    def __init__(
        self,
        id: str = "",
        badge_number: str = "OFFICER-704",
        name: str = "Vikas Gowda",
        assigned_zone_id: str = "zone-pub-01",
        assigned_zone_name: str = "Municipal Central Parking & CBD",
        handheld_device_id: str = "POS-TAB-902",
        citations_issued_today: int = 3,
        patrol_status: str = "ON_PATROL",  # ON_PATROL | ON_BREAK | DISPATCHED_TO_INCIDENT
        last_gps_ping: Optional[datetime] = None
    ):
        self.id = id or f"off-{uuid.uuid4().hex[:8]}"
        self.badge_number = badge_number
        self.name = name
        self.assigned_zone_id = assigned_zone_id
        self.assigned_zone_name = assigned_zone_name
        self.handheld_device_id = handheld_device_id
        self.citations_issued_today = citations_issued_today
        self.patrol_status = patrol_status
        self.last_gps_ping = last_gps_ping or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "badge_number": self.badge_number,
            "name": self.name,
            "assigned_zone_id": self.assigned_zone_id,
            "assigned_zone_name": self.assigned_zone_name,
            "handheld_device_id": self.handheld_device_id,
            "citations_issued_today": self.citations_issued_today,
            "patrol_status": self.patrol_status,
            "last_gps_ping": self.last_gps_ping.isoformat() if isinstance(self.last_gps_ping, datetime) else self.last_gps_ping
        }

class PatrolOfficerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS patrol_officers (
                    id TEXT PRIMARY KEY,
                    badge_number TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    assigned_zone_id TEXT NOT NULL,
                    assigned_zone_name TEXT,
                    handheld_device_id TEXT NOT NULL,
                    citations_issued_today INTEGER DEFAULT 0,
                    patrol_status TEXT DEFAULT 'ON_PATROL',
                    last_gps_ping TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(off: PatrolOfficer) -> bool:
        PatrolOfficerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO patrol_officers (
                    id, badge_number, name, assigned_zone_id,
                    assigned_zone_name, handheld_device_id,
                    citations_issued_today, patrol_status, last_gps_ping
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                off.id, off.badge_number, off.name, off.assigned_zone_id,
                off.assigned_zone_name, off.handheld_device_id,
                off.citations_issued_today, off.patrol_status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_all() -> List[PatrolOfficer]:
        PatrolOfficerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM patrol_officers ORDER BY badge_number ASC")
            return [PatrolOfficer(**dict(r)) for r in cursor.fetchall()]

PatrolOfficerRepository.init_table()
