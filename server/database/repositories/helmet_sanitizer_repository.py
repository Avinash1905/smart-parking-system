"""
SmartPark Two-Wheeler Helmet UV-C Sanitizer Lockbox Repository Layer
Manages 254nm ultraviolet germicidal irradiation chambers, 90-second pathogen sterilization cycles, and commuter helmet locker releases.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class HelmetSanitizerLocker:
    def __init__(
        self,
        id: str = "",
        locker_code: str = "HELMET-UVC-04",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor G Two-Wheeler Bay",
        uvc_irradiance_uw_cm2: float = 850.0,
        sterilization_cycle_seconds: int = 90,
        pathogen_kill_rate_pct: float = 99.99,
        cycles_completed_today: int = 34,
        door_interlock_locked: bool = True,
        sanitization_status: str = "CYCLE_COMPLETED_STERILIZED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"hsv-{uuid.uuid4().hex[:8]}"
        self.locker_code = locker_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.uvc_irradiance_uw_cm2 = uvc_irradiance_uw_cm2
        self.sterilization_cycle_seconds = sterilization_cycle_seconds
        self.pathogen_kill_rate_pct = pathogen_kill_rate_pct
        self.cycles_completed_today = cycles_completed_today
        self.door_interlock_locked = door_interlock_locked
        self.sanitization_status = sanitization_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "locker_code": self.locker_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "uvc_irradiance_uw_cm2": self.uvc_irradiance_uw_cm2,
            "sterilization_cycle_seconds": self.sterilization_cycle_seconds,
            "pathogen_kill_rate_pct": self.pathogen_kill_rate_pct,
            "cycles_completed_today": self.cycles_completed_today,
            "door_interlock_locked": self.door_interlock_locked,
            "sanitization_status": self.sanitization_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class HelmetSanitizerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS helmet_sanitizer_lockers (
                    id TEXT PRIMARY KEY,
                    locker_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    uvc_irradiance_uw_cm2 REAL DEFAULT 850.0,
                    sterilization_cycle_seconds INTEGER DEFAULT 90,
                    pathogen_kill_rate_pct REAL DEFAULT 99.99,
                    cycles_completed_today INTEGER DEFAULT 34,
                    door_interlock_locked INTEGER DEFAULT 1,
                    sanitization_status TEXT DEFAULT 'CYCLE_COMPLETED_STERILIZED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> HelmetSanitizerLocker:
        HelmetSanitizerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM helmet_sanitizer_lockers WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["door_interlock_locked"] = bool(d["door_interlock_locked"])
                return HelmetSanitizerLocker(**d)
            locker = HelmetSanitizerLocker(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO helmet_sanitizer_lockers (
                    id, locker_code, zone_id, floor_level,
                    uvc_irradiance_uw_cm2, sterilization_cycle_seconds,
                    pathogen_kill_rate_pct, cycles_completed_today,
                    door_interlock_locked, sanitization_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                locker.id, locker.locker_code, locker.zone_id,
                locker.floor_level, locker.uvc_irradiance_uw_cm2,
                locker.sterilization_cycle_seconds,
                locker.pathogen_kill_rate_pct,
                locker.cycles_completed_today,
                1 if locker.door_interlock_locked else 0,
                locker.sanitization_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return locker

HelmetSanitizerRepository.init_table()
