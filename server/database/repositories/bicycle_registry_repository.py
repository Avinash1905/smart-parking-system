"""
SmartPark Stolen Bicycle & Micro-Mobility Serial Registry Repository Layer
Manages bicycle frame engraved serials, RFID commuter tags, and anti-theft dock alarms.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BicycleRegistration:
    def __init__(
        self,
        id: str = "",
        frame_serial_number: str = "TREK-SN-8829104",
        owner_name: str = "Kavita Rao",
        owner_email: str = "kavita.r@gmail.com",
        bicycle_make_model: str = "Trek Marlin 7 Hardtail MTB",
        rfid_tag_id: str = "RFID-BIKE-4401",
        is_reported_stolen: bool = False,
        assigned_dock_bay: str = "2W-BIKE-RACK-04",
        status: str = "REGISTERED_ACTIVE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"bik-{uuid.uuid4().hex[:8]}"
        self.frame_serial_number = frame_serial_number
        self.owner_name = owner_name
        self.owner_email = owner_email
        self.bicycle_make_model = bicycle_make_model
        self.rfid_tag_id = rfid_tag_id
        self.is_reported_stolen = is_reported_stolen
        self.assigned_dock_bay = assigned_dock_bay
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "frame_serial_number": self.frame_serial_number,
            "owner_name": self.owner_name,
            "owner_email": self.owner_email,
            "bicycle_make_model": self.bicycle_make_model,
            "rfid_tag_id": self.rfid_tag_id,
            "is_reported_stolen": self.is_reported_stolen,
            "assigned_dock_bay": self.assigned_dock_bay,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class BicycleRegistryRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS bicycle_registrations (
                    id TEXT PRIMARY KEY,
                    frame_serial_number TEXT UNIQUE NOT NULL,
                    owner_name TEXT NOT NULL,
                    owner_email TEXT NOT NULL,
                    bicycle_make_model TEXT NOT NULL,
                    rfid_tag_id TEXT UNIQUE NOT NULL,
                    is_reported_stolen INTEGER DEFAULT 0,
                    assigned_dock_bay TEXT NOT NULL,
                    status TEXT DEFAULT 'REGISTERED_ACTIVE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[BicycleRegistration]:
        BicycleRegistryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM bicycle_registrations ORDER BY created_at DESC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["is_reported_stolen"] = bool(d["is_reported_stolen"])
                res.append(BicycleRegistration(**d))
            return res

    @staticmethod
    def create(item: BicycleRegistration) -> bool:
        BicycleRegistryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO bicycle_registrations (
                    id, frame_serial_number, owner_name, owner_email,
                    bicycle_make_model, rfid_tag_id, is_reported_stolen,
                    assigned_dock_bay, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.frame_serial_number, item.owner_name,
                item.owner_email, item.bicycle_make_model,
                item.rfid_tag_id, 1 if item.is_reported_stolen else 0,
                item.assigned_dock_bay, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

BicycleRegistryRepository.init_table()
