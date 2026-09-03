"""
SmartPark Digital Wallet (PKPass) Barcode Parking Pass Repository Layer
Manages dynamic encrypted QR passes, Apple Wallet / Google Wallet payload tokens, and automated boom barrier check-in scans.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TicketWalletPass:
    def __init__(
        self,
        id: str = "",
        pass_serial: str = "PKPASS-9048-KA01",
        user_id: str = "usr-882",
        vehicle_plate: str = "KA-01-EQ-9988",
        slot_code: str = "A-04",
        entry_time_str: str = "10:30 AM",
        parking_rate_inr_hr: float = 60.0,
        pass_format: str = "APPLE_GOOGLE_WALLET_PKPASS",
        qr_auth_token: str = "SMPK-AUTH-9821-X992",
        pass_status: str = "ACTIVE_DIGITAL_PASS",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"twp-{uuid.uuid4().hex[:8]}"
        self.pass_serial = pass_serial
        self.user_id = user_id
        self.vehicle_plate = vehicle_plate
        self.slot_code = slot_code
        self.entry_time_str = entry_time_str
        self.parking_rate_inr_hr = parking_rate_inr_hr
        self.pass_format = pass_format
        self.qr_auth_token = qr_auth_token
        self.pass_status = pass_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "pass_serial": self.pass_serial,
            "user_id": self.user_id,
            "vehicle_plate": self.vehicle_plate,
            "slot_code": self.slot_code,
            "entry_time_str": self.entry_time_str,
            "parking_rate_inr_hr": self.parking_rate_inr_hr,
            "pass_format": self.pass_format,
            "qr_auth_token": self.qr_auth_token,
            "pass_status": self.pass_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class TicketWalletRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ticket_wallet_passes (
                    id TEXT PRIMARY KEY,
                    pass_serial TEXT UNIQUE NOT NULL,
                    user_id TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    slot_code TEXT NOT NULL,
                    entry_time_str TEXT DEFAULT '10:30 AM',
                    parking_rate_inr_hr REAL DEFAULT 60.0,
                    pass_format TEXT DEFAULT 'APPLE_GOOGLE_WALLET_PKPASS',
                    qr_auth_token TEXT NOT NULL,
                    pass_status TEXT DEFAULT 'ACTIVE_DIGITAL_PASS',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(user_id: str = "usr-882") -> TicketWalletPass:
        TicketWalletRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ticket_wallet_passes WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1", (user_id,))
            row = cursor.fetchone()
            if row:
                return TicketWalletPass(**dict(row))
            item = TicketWalletPass(user_id=user_id)
            cursor.execute("""
                INSERT INTO ticket_wallet_passes (
                    id, pass_serial, user_id, vehicle_plate,
                    slot_code, entry_time_str, parking_rate_inr_hr,
                    pass_format, qr_auth_token, pass_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.pass_serial, item.user_id,
                item.vehicle_plate, item.slot_code,
                item.entry_time_str, item.parking_rate_inr_hr,
                item.pass_format, item.qr_auth_token, item.pass_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return item

TicketWalletRepository.init_table()
