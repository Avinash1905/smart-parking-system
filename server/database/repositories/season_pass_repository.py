"""
SmartPark Monthly Season Pass & Corporate Subscription Repository Layer
Manages recurring unlimited parking passes, multi-vehicle transferable permits, and corporate passes.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SeasonPass:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        pass_name: str = "CBD Unlimited Monthly All-Access Pass",
        pass_tier: str = "ALL_MUNICIPAL_DECKS",  # SINGLE_FACILITY | ALL_MUNICIPAL_DECKS | CORPORATE_CAMPUS_VIP
        zone_id: Optional[str] = "zone-pub-01",
        monthly_fee: float = 2499.0,
        valid_until: Optional[datetime] = None,
        linked_vehicle_plates: Optional[List[str]] = None,
        status: str = "ACTIVE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"spass-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.pass_name = pass_name
        self.pass_tier = pass_tier
        self.zone_id = zone_id
        self.monthly_fee = monthly_fee
        self.valid_until = valid_until or datetime.utcnow()
        self.linked_vehicle_plates = linked_vehicle_plates or ["KA-01-MJ-5890"]
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "pass_name": self.pass_name,
            "pass_tier": self.pass_tier,
            "zone_id": self.zone_id,
            "monthly_fee": self.monthly_fee,
            "valid_until": self.valid_until.isoformat() if isinstance(self.valid_until, datetime) else self.valid_until,
            "linked_vehicle_plates": self.linked_vehicle_plates,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class SeasonPassRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS season_passes (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    pass_name TEXT NOT NULL,
                    pass_tier TEXT DEFAULT 'ALL_MUNICIPAL_DECKS',
                    zone_id TEXT,
                    monthly_fee REAL DEFAULT 2499.0,
                    valid_until TEXT,
                    linked_vehicle_plates TEXT,
                    status TEXT DEFAULT 'ACTIVE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(p: SeasonPass) -> bool:
        SeasonPassRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO season_passes (
                    id, user_id, pass_name, pass_tier, zone_id,
                    monthly_fee, valid_until, linked_vehicle_plates,
                    status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p.id, p.user_id, p.pass_name, p.pass_tier, p.zone_id,
                p.monthly_fee,
                p.valid_until.isoformat() if isinstance(p.valid_until, datetime) else p.valid_until,
                json.dumps(p.linked_vehicle_plates), p.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_by_user(user_id: str) -> List[SeasonPass]:
        SeasonPassRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM season_passes WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["linked_vehicle_plates"] = json.loads(d["linked_vehicle_plates"] or "[]")
                res.append(SeasonPass(**d))
            return res

SeasonPassRepository.init_table()
