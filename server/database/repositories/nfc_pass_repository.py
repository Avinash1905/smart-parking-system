"""
SmartPark Physical & Digital NFC Smart Pass Repository Layer
Manages physical RFID cards, mobile NFC wallet tokens, pre-paid balances, and contactless tap-in/tap-out logs.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class NFCSmartPass:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        card_uid: str = "04A1B2C3D4E5F6",
        card_label: str = "SmartPark Black Titanium Pass",
        balance: float = 1250.0,
        auto_topup_enabled: bool = True,
        auto_topup_threshold: float = 200.0,
        auto_topup_amount: float = 1000.0,
        status: str = "ACTIVE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"nfc-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.card_uid = card_uid
        self.card_label = card_label
        self.balance = balance
        self.auto_topup_enabled = auto_topup_enabled
        self.auto_topup_threshold = auto_topup_threshold
        self.auto_topup_amount = auto_topup_amount
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "card_uid": self.card_uid,
            "card_label": self.card_label,
            "balance": self.balance,
            "auto_topup_enabled": self.auto_topup_enabled,
            "auto_topup_threshold": self.auto_topup_threshold,
            "auto_topup_amount": self.auto_topup_amount,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class NFCRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS nfc_passes (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    card_uid TEXT UNIQUE NOT NULL,
                    card_label TEXT NOT NULL,
                    balance REAL DEFAULT 1250.0,
                    auto_topup_enabled INTEGER DEFAULT 1,
                    auto_topup_threshold REAL DEFAULT 200.0,
                    auto_topup_amount REAL DEFAULT 1000.0,
                    status TEXT DEFAULT 'ACTIVE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(pass_obj: NFCSmartPass) -> bool:
        NFCRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO nfc_passes (
                    id, user_id, card_uid, card_label, balance,
                    auto_topup_enabled, auto_topup_threshold,
                    auto_topup_amount, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                pass_obj.id, pass_obj.user_id, pass_obj.card_uid,
                pass_obj.card_label, pass_obj.balance,
                1 if pass_obj.auto_topup_enabled else 0,
                pass_obj.auto_topup_threshold, pass_obj.auto_topup_amount,
                pass_obj.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def get_by_user(user_id: str) -> Optional[NFCSmartPass]:
        NFCRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM nfc_passes WHERE user_id = ?", (user_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["auto_topup_enabled"] = bool(d["auto_topup_enabled"])
                return NFCSmartPass(**d)
            return None

NFCRepository.init_table()
