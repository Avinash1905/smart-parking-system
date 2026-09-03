"""
SmartPark NETC FASTag & Electronic Toll RFID Integration Repository Layer
Manages Indian National Electronic Toll Collection (FASTag) wallet linkages, bank clearance, and automated drive-through.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FASTagAccount:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        vehicle_plate: str = "KA-01-MJ-5890",
        fastag_tag_id: str = "34161FA820328901",
        issuing_bank: str = "ICICI Bank NETC FASTag",
        fastag_wallet_balance: float = 850.0,
        auto_deduct_parking_enabled: bool = True,
        status: str = "ACTIVE_LINKED",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"ftag-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.vehicle_plate = vehicle_plate
        self.fastag_tag_id = fastag_tag_id
        self.issuing_bank = issuing_bank
        self.fastag_wallet_balance = fastag_wallet_balance
        self.auto_deduct_parking_enabled = auto_deduct_parking_enabled
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "vehicle_plate": self.vehicle_plate,
            "fastag_tag_id": self.fastag_tag_id,
            "issuing_bank": self.issuing_bank,
            "fastag_wallet_balance": self.fastag_wallet_balance,
            "auto_deduct_parking_enabled": self.auto_deduct_parking_enabled,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class FASTagRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS fastag_accounts (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    vehicle_plate TEXT UNIQUE NOT NULL,
                    fastag_tag_id TEXT UNIQUE NOT NULL,
                    issuing_bank TEXT NOT NULL,
                    fastag_wallet_balance REAL DEFAULT 850.0,
                    auto_deduct_parking_enabled INTEGER DEFAULT 1,
                    status TEXT DEFAULT 'ACTIVE_LINKED',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_by_plate(plate: str) -> Optional[FASTagAccount]:
        FASTagRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM fastag_accounts WHERE UPPER(vehicle_plate) = ?", (plate.upper().strip(),))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["auto_deduct_parking_enabled"] = bool(d["auto_deduct_parking_enabled"])
                return FASTagAccount(**d)
            return None

    @staticmethod
    def create(item: FASTagAccount) -> bool:
        FASTagRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO fastag_accounts (
                    id, user_id, vehicle_plate, fastag_tag_id,
                    issuing_bank, fastag_wallet_balance,
                    auto_deduct_parking_enabled, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.user_id, item.vehicle_plate,
                item.fastag_tag_id, item.issuing_bank,
                item.fastag_wallet_balance,
                1 if item.auto_deduct_parking_enabled else 0,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

FASTagRepository.init_table()
