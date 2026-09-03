"""
SmartPark Dynamic Variable Curb & Delivery Loading Zone Repository Layer
Manages time-of-day flexible curb-space allocations (morning commercial freight, daytime visitor parking, evening food staging).
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class DynamicCurbSpace:
    def __init__(
        self,
        id: str = "",
        curb_code: str = "CURB-MG-BAY-01",
        street_name: str = "MG Road Civic Boulevard",
        current_time_window: str = "08:00 - 11:00 AM",
        active_curb_policy: str = "COMMERCIAL_FREIGHT_LOADING",  # COMMERCIAL_FREIGHT_LOADING | SHORT_STAY_PARKING | FOOD_COURIER_STAGING | NO_STOPPING
        allowed_vehicle_types: Optional[List[str]] = None,
        max_dwell_minutes: int = 30,
        digital_led_curb_sign_status: str = "ACTIVE_DISPLAYING",
        status: str = "ENFORCING_DYNAMIC_REGULATION",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"crb-{uuid.uuid4().hex[:8]}"
        self.curb_code = curb_code
        self.street_name = street_name
        self.current_time_window = current_time_window
        self.active_curb_policy = active_curb_policy
        self.allowed_vehicle_types = allowed_vehicle_types or ["COMMERCIAL_TRUCK", "DELIVERY_VAN"]
        self.max_dwell_minutes = max_dwell_minutes
        self.digital_led_curb_sign_status = digital_led_curb_sign_status
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "curb_code": self.curb_code,
            "street_name": self.street_name,
            "current_time_window": self.current_time_window,
            "active_curb_policy": self.active_curb_policy,
            "allowed_vehicle_types": self.allowed_vehicle_types,
            "max_dwell_minutes": self.max_dwell_minutes,
            "digital_led_curb_sign_status": self.digital_led_curb_sign_status,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CurbZoneRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS dynamic_curb_spaces (
                    id TEXT PRIMARY KEY,
                    curb_code TEXT UNIQUE NOT NULL,
                    street_name TEXT NOT NULL,
                    current_time_window TEXT NOT NULL,
                    active_curb_policy TEXT DEFAULT 'COMMERCIAL_FREIGHT_LOADING',
                    allowed_vehicle_types TEXT,
                    max_dwell_minutes INTEGER DEFAULT 30,
                    digital_led_curb_sign_status TEXT DEFAULT 'ACTIVE_DISPLAYING',
                    status TEXT DEFAULT 'ENFORCING_DYNAMIC_REGULATION',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[DynamicCurbSpace]:
        CurbZoneRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM dynamic_curb_spaces ORDER BY curb_code ASC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                if d.get("allowed_vehicle_types"):
                    d["allowed_vehicle_types"] = json.loads(d["allowed_vehicle_types"])
                res.append(DynamicCurbSpace(**d))
            return res

    @staticmethod
    def create(item: DynamicCurbSpace) -> bool:
        CurbZoneRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO dynamic_curb_spaces (
                    id, curb_code, street_name, current_time_window,
                    active_curb_policy, allowed_vehicle_types,
                    max_dwell_minutes, digital_led_curb_sign_status,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.curb_code, item.street_name,
                item.current_time_window, item.active_curb_policy,
                json.dumps(item.allowed_vehicle_types),
                item.max_dwell_minutes, item.digital_led_curb_sign_status,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

CurbZoneRepository.init_table()
