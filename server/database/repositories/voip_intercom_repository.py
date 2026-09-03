"""
SmartPark VoIP Digital Intercom & Emergency Help Point Repository Layer
Manages two-way audio station callboxes at boom barriers, elevator lobbies, and emergency panic poles.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class IntercomCallbox:
    def __init__(
        self,
        id: str = "",
        callbox_code: str = "ICOM-NORTH-GATE-01",
        location_label: str = "North Barrier Gate #1 Helpbox",
        zone_id: str = "zone-pub-01",
        sip_extension: str = "1041",
        is_call_active: bool = False,
        speaker_volume_pct: int = 85,
        microphone_db_gain: int = 18,
        status: str = "ONLINE_STANDBY",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"icom-{uuid.uuid4().hex[:8]}"
        self.callbox_code = callbox_code
        self.location_label = location_label
        self.zone_id = zone_id
        self.sip_extension = sip_extension
        self.is_call_active = is_call_active
        self.speaker_volume_pct = speaker_volume_pct
        self.microphone_db_gain = microphone_db_gain
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "callbox_code": self.callbox_code,
            "location_label": self.location_label,
            "zone_id": self.zone_id,
            "sip_extension": self.sip_extension,
            "is_call_active": self.is_call_active,
            "speaker_volume_pct": self.speaker_volume_pct,
            "microphone_db_gain": self.microphone_db_gain,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class IntercomRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS intercom_callboxes (
                    id TEXT PRIMARY KEY,
                    callbox_code TEXT UNIQUE NOT NULL,
                    location_label TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    sip_extension TEXT NOT NULL,
                    is_call_active INTEGER DEFAULT 0,
                    speaker_volume_pct INTEGER DEFAULT 85,
                    microphone_db_gain INTEGER DEFAULT 18,
                    status TEXT DEFAULT 'ONLINE_STANDBY',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[IntercomCallbox]:
        IntercomRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM intercom_callboxes ORDER BY callbox_code ASC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["is_call_active"] = bool(d["is_call_active"])
                res.append(IntercomCallbox(**d))
            return res

    @staticmethod
    def create(item: IntercomCallbox) -> bool:
        IntercomRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO intercom_callboxes (
                    id, callbox_code, location_label, zone_id,
                    sip_extension, is_call_active, speaker_volume_pct,
                    microphone_db_gain, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.callbox_code, item.location_label,
                item.zone_id, item.sip_extension,
                1 if item.is_call_active else 0,
                item.speaker_volume_pct, item.microphone_db_gain,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

IntercomRepository.init_table()
