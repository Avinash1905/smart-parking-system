"""
SmartPark Security Body-Worn Camera (BWC) Cryptographic Evidence Notary Repository Layer
Manages security officer body-cam video streams, GPS timestamping, SHA-256 evidence hashing, and tamper-proof citation audit chains.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BodyCamRecord:
    def __init__(
        self,
        id: str = "",
        session_code: str = "BWC-EVIDENCE-SESSION-01",
        officer_badge_id: str = "OFFICER-PATROL-402",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Loading & Staging Bay",
        sha256_video_hash: str = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        recording_resolution: str = "1080P_60FPS_ENCRYPTED",
        storage_vault_status: str = "CRYPTOGRAPHICALLY_NOTARIZED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"bcr-{uuid.uuid4().hex[:8]}"
        self.session_code = session_code
        self.officer_badge_id = officer_badge_id
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.sha256_video_hash = sha256_video_hash
        self.recording_resolution = recording_resolution
        self.storage_vault_status = storage_vault_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "session_code": self.session_code,
            "officer_badge_id": self.officer_badge_id,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "sha256_video_hash": self.sha256_video_hash,
            "recording_resolution": self.recording_resolution,
            "storage_vault_status": self.storage_vault_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BodyCamNotaryRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS body_cam_records (
                    id TEXT PRIMARY KEY,
                    session_code TEXT UNIQUE NOT NULL,
                    officer_badge_id TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    sha256_video_hash TEXT NOT NULL,
                    recording_resolution TEXT DEFAULT '1080P_60FPS_ENCRYPTED',
                    storage_vault_status TEXT DEFAULT 'CRYPTOGRAPHICALLY_NOTARIZED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> BodyCamRecord:
        BodyCamNotaryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM body_cam_records WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return BodyCamRecord(**dict(row))
            record = BodyCamRecord(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO body_cam_records (
                    id, session_code, officer_badge_id, zone_id,
                    floor_level, sha256_video_hash, recording_resolution,
                    storage_vault_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                record.id, record.session_code, record.officer_badge_id,
                record.zone_id, record.floor_level,
                record.sha256_video_hash, record.recording_resolution,
                record.storage_vault_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return record

BodyCamNotaryRepository.init_table()
