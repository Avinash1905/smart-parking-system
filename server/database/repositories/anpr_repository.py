"""
SmartPark ANPR (Automated Number Plate Recognition) Video Stream Repository Layer
Records license plate OCR capture events, camera confidence scores, and gate barrier triggers.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ANPRCaptureEvent:
    def __init__(
        self,
        id: str = "",
        camera_id: str = "CAM-NORTH-01",
        camera_location: str = "North Gate Entry Barrier",
        detected_plate: str = "KA-01-MJ-5890",
        confidence_score: float = 0.985,
        matched_user_id: Optional[str] = "usr-tcs-01",
        matched_reservation_id: Optional[str] = "RES-A2401",
        barrier_action: str = "GATE_LIFTED_AUTO",  # GATE_LIFTED_AUTO | ACCESS_DENIED | MANUAL_REVIEW
        processing_time_ms: int = 42,
        snapshot_url: Optional[str] = None,
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"anpr-{uuid.uuid4().hex[:8]}"
        self.camera_id = camera_id
        self.camera_location = camera_location
        self.detected_plate = detected_plate
        self.confidence_score = confidence_score
        self.matched_user_id = matched_user_id
        self.matched_reservation_id = matched_reservation_id
        self.barrier_action = barrier_action
        self.processing_time_ms = processing_time_ms
        self.snapshot_url = snapshot_url
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "camera_id": self.camera_id,
            "camera_location": self.camera_location,
            "detected_plate": self.detected_plate,
            "confidence_score": self.confidence_score,
            "matched_user_id": self.matched_user_id,
            "matched_reservation_id": self.matched_reservation_id,
            "barrier_action": self.barrier_action,
            "processing_time_ms": self.processing_time_ms,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class ANPRRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS anpr_capture_events (
                    id TEXT PRIMARY KEY,
                    camera_id TEXT NOT NULL,
                    camera_location TEXT NOT NULL,
                    detected_plate TEXT NOT NULL,
                    confidence_score REAL DEFAULT 0.98,
                    matched_user_id TEXT,
                    matched_reservation_id TEXT,
                    barrier_action TEXT DEFAULT 'GATE_LIFTED_AUTO',
                    processing_time_ms INTEGER DEFAULT 42,
                    snapshot_url TEXT,
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(evt: ANPRCaptureEvent) -> bool:
        ANPRRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO anpr_capture_events (
                    id, camera_id, camera_location, detected_plate,
                    confidence_score, matched_user_id, matched_reservation_id,
                    barrier_action, processing_time_ms, snapshot_url, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                evt.id, evt.camera_id, evt.camera_location, evt.detected_plate,
                evt.confidence_score, evt.matched_user_id, evt.matched_reservation_id,
                evt.barrier_action, evt.processing_time_ms, evt.snapshot_url, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_recent(limit: int = 50) -> List[ANPRCaptureEvent]:
        ANPRRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM anpr_capture_events ORDER BY created_at DESC LIMIT ?", (limit,))
            return [ANPRCaptureEvent(**dict(r)) for r in cursor.fetchall()]

ANPRRepository.init_table()
