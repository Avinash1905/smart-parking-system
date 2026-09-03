"""
SmartPark UV-C Robotic Disinfection & Sanitization Repository Layer
Manages robotic UV-C germicidal light sweeps across stalls, air purification, and sanitization logs.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class UVCSanitizationRecord:
    def __init__(
        self,
        id: str = "",
        slot_code: str = "A-24",
        zone_id: str = "zone-pub-01",
        robot_unit_id: str = "ROBO-STERIL-04",
        uvc_dosage_mj_cm2: float = 28.4,
        pathogen_kill_rate_pct: float = 99.99,
        duration_seconds: int = 120,
        status: str = "SANITIZED_CERTIFIED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"uvc-{uuid.uuid4().hex[:8]}"
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.robot_unit_id = robot_unit_id
        self.uvc_dosage_mj_cm2 = uvc_dosage_mj_cm2
        self.pathogen_kill_rate_pct = pathogen_kill_rate_pct
        self.duration_seconds = duration_seconds
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "robot_unit_id": self.robot_unit_id,
            "uvc_dosage_mj_cm2": self.uvc_dosage_mj_cm2,
            "pathogen_kill_rate_pct": self.pathogen_kill_rate_pct,
            "duration_seconds": self.duration_seconds,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class UVCSanitizationRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS uvc_sanitization_records (
                    id TEXT PRIMARY KEY,
                    slot_code TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    robot_unit_id TEXT NOT NULL,
                    uvc_dosage_mj_cm2 REAL DEFAULT 28.4,
                    pathogen_kill_rate_pct REAL DEFAULT 99.99,
                    duration_seconds INTEGER DEFAULT 120,
                    status TEXT DEFAULT 'SANITIZED_CERTIFIED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(rec: UVCSanitizationRecord) -> bool:
        UVCSanitizationRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO uvc_sanitization_records (
                    id, slot_code, zone_id, robot_unit_id,
                    uvc_dosage_mj_cm2, pathogen_kill_rate_pct,
                    duration_seconds, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                rec.id, rec.slot_code, rec.zone_id, rec.robot_unit_id,
                rec.uvc_dosage_mj_cm2, rec.pathogen_kill_rate_pct,
                rec.duration_seconds, rec.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_recent(limit: int = 10) -> List[UVCSanitizationRecord]:
        UVCSanitizationRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM uvc_sanitization_records ORDER BY timestamp DESC LIMIT ?", (limit,))
            return [UVCSanitizationRecord(**dict(r)) for r in cursor.fetchall()]

UVCSanitizationRepository.init_table()
