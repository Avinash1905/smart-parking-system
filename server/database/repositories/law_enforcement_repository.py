"""
SmartPark Law Enforcement Blacklist & Stolen Vehicle Repository Layer
Tracks police hotlist vehicle license plates, automated police alerts, and emergency barrier lockdowns.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BlacklistRecord:
    def __init__(
        self,
        id: str = "",
        registration_plate: str = "KA-04-XX-9999",
        reason: str = "STOLEN_VEHICLE_REPORT",  # STOLEN_VEHICLE_REPORT | UNPAID_MUNICIPAL_WARRANTS | HIT_AND_RUN
        issuing_agency: str = "Bengaluru City Police (Control Room)",
        case_reference_id: str = "FIR-2026-8902",
        action_on_detection: str = "LOCK_GATE_AND_ALERT_POLICE",
        status: str = "ACTIVE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"blk-{uuid.uuid4().hex[:8]}"
        self.registration_plate = registration_plate.upper().strip()
        self.reason = reason
        self.issuing_agency = issuing_agency
        self.case_reference_id = case_reference_id
        self.action_on_detection = action_on_detection
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "registration_plate": self.registration_plate,
            "reason": self.reason,
            "issuing_agency": self.issuing_agency,
            "case_reference_id": self.case_reference_id,
            "action_on_detection": self.action_on_detection,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class LawEnforcementRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS blacklisted_plates (
                    id TEXT PRIMARY KEY,
                    registration_plate TEXT UNIQUE NOT NULL,
                    reason TEXT NOT NULL,
                    issuing_agency TEXT NOT NULL,
                    case_reference_id TEXT NOT NULL,
                    action_on_detection TEXT DEFAULT 'LOCK_GATE_AND_ALERT_POLICE',
                    status TEXT DEFAULT 'ACTIVE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(item: BlacklistRecord) -> bool:
        LawEnforcementRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO blacklisted_plates (
                    id, registration_plate, reason, issuing_agency,
                    case_reference_id, action_on_detection, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.registration_plate, item.reason,
                item.issuing_agency, item.case_reference_id,
                item.action_on_detection, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def check_plate(plate: str) -> Optional[BlacklistRecord]:
        LawEnforcementRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM blacklisted_plates WHERE UPPER(registration_plate) = ? AND status = 'ACTIVE'", (plate.upper().strip(),))
            row = cursor.fetchone()
            return BlacklistRecord(**dict(row)) if row else None

LawEnforcementRepository.init_table()
