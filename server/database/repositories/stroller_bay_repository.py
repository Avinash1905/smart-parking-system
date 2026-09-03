"""
SmartPark Driver Child Stroller UV-C Sanitized Rental Bay Repository Layer
Manages ergonomic infant/toddler strollers, UV-C germicidal docking bays, NFC tap releases, and family parking hospitality.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class StrollerBayNode:
    def __init__(
        self,
        id: str = "",
        bay_code: str = "STROLLER-DOCK-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Family Elevator Vestibule",
        available_strollers_count: int = 8,
        total_capacity: int = 10,
        unlocked_stroller_code: str = "STROLLER-UV-03",
        uvc_disinfection_active: bool = True,
        dispenser_solenoid_state: str = "DOCK_LOCKED_STANDBY",
        status: str = "STROLLERS_READY_TO_RENT",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"sbn-{uuid.uuid4().hex[:8]}"
        self.bay_code = bay_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.available_strollers_count = available_strollers_count
        self.total_capacity = total_capacity
        self.unlocked_stroller_code = unlocked_stroller_code
        self.uvc_disinfection_active = uvc_disinfection_active
        self.dispenser_solenoid_state = dispenser_solenoid_state
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "bay_code": self.bay_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "available_strollers_count": self.available_strollers_count,
            "total_capacity": self.total_capacity,
            "unlocked_stroller_code": self.unlocked_stroller_code,
            "uvc_disinfection_active": self.uvc_disinfection_active,
            "dispenser_solenoid_state": self.dispenser_solenoid_state,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class StrollerBayRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS stroller_bay_nodes (
                    id TEXT PRIMARY KEY,
                    bay_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    available_strollers_count INTEGER DEFAULT 8,
                    total_capacity INTEGER DEFAULT 10,
                    unlocked_stroller_code TEXT DEFAULT 'STROLLER-UV-03',
                    uvc_disinfection_active INTEGER DEFAULT 1,
                    dispenser_solenoid_state TEXT DEFAULT 'DOCK_LOCKED_STANDBY',
                    status TEXT DEFAULT 'STROLLERS_READY_TO_RENT',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> StrollerBayNode:
        StrollerBayRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM stroller_bay_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["uvc_disinfection_active"] = bool(d["uvc_disinfection_active"])
                return StrollerBayNode(**d)
            bay = StrollerBayNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO stroller_bay_nodes (
                    id, bay_code, zone_id, floor_level,
                    available_strollers_count, total_capacity,
                    unlocked_stroller_code, uvc_disinfection_active,
                    dispenser_solenoid_state, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                bay.id, bay.bay_code, bay.zone_id, bay.floor_level,
                bay.available_strollers_count, bay.total_capacity,
                bay.unlocked_stroller_code,
                1 if bay.uvc_disinfection_active else 0,
                bay.dispenser_solenoid_state,
                bay.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return bay

StrollerBayRepository.init_table()
