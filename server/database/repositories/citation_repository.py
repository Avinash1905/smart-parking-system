"""
SmartPark Municipal Citation Appeals & Dispute Repository Layer
Handles formal dispute submissions, administrative evidence reviews, hearing schedules, and fine waivers.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CitationAppeal:
    def __init__(
        self,
        id: str = "",
        violation_id: str = "V-1024",
        user_id: str = "",
        driver_name: str = "Avinash Sharma",
        vehicle_plate: str = "KA-01-MJ-5890",
        dispute_reason: str = "GATE_TAG_MALFUNCTION",
        explanation: str = "Barrier RFID reader failed to acknowledge tag.",
        evidence_attachment_url: Optional[str] = None,
        adjudicator_notes: Optional[str] = None,
        status: str = "SUBMITTED",  # SUBMITTED | IN_REVIEW | GRANTED_WAIVER | REJECTED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"DISP-{uuid.uuid4().hex[:6].upper()}"
        self.violation_id = violation_id
        self.user_id = user_id
        self.driver_name = driver_name
        self.vehicle_plate = vehicle_plate
        self.dispute_reason = dispute_reason
        self.explanation = explanation
        self.evidence_attachment_url = evidence_attachment_url
        self.adjudicator_notes = adjudicator_notes
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "violation_id": self.violation_id,
            "user_id": self.user_id,
            "driver_name": self.driver_name,
            "vehicle_plate": self.vehicle_plate,
            "dispute_reason": self.dispute_reason,
            "explanation": self.explanation,
            "evidence_attachment_url": self.evidence_attachment_url,
            "adjudicator_notes": self.adjudicator_notes,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class CitationRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS citation_appeals (
                    id TEXT PRIMARY KEY,
                    violation_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    driver_name TEXT,
                    vehicle_plate TEXT NOT NULL,
                    dispute_reason TEXT NOT NULL,
                    explanation TEXT NOT NULL,
                    evidence_attachment_url TEXT,
                    adjudicator_notes TEXT,
                    status TEXT DEFAULT 'SUBMITTED',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(appeal: CitationAppeal) -> bool:
        CitationRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO citation_appeals (
                    id, violation_id, user_id, driver_name, vehicle_plate,
                    dispute_reason, explanation, evidence_attachment_url,
                    adjudicator_notes, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                appeal.id, appeal.violation_id, appeal.user_id,
                appeal.driver_name, appeal.vehicle_plate, appeal.dispute_reason,
                appeal.explanation, appeal.evidence_attachment_url,
                appeal.adjudicator_notes, appeal.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_all() -> List[CitationAppeal]:
        CitationRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM citation_appeals ORDER BY created_at DESC")
            return [CitationAppeal(**dict(r)) for r in cursor.fetchall()]

CitationRepository.init_table()
