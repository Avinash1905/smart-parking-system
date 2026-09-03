"""
SmartPark Wheel Boot Immobilization & Tow Truck Dispatch Repository Layer
Manages smart wheel clamp padlocks, fine settlement release codes, and municipal impound yard transfers.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class WheelBootEnforcement:
    def __init__(
        self,
        id: str = "",
        boot_code: str = "BOOT-CLAMP-08",
        vehicle_plate: str = "KA-05-ZZ-9911",
        zone_id: str = "zone-pub-01",
        violation_reason: str = "Unpaid Habitual Overstay (> 48 Hours)",
        fine_amount_inr: float = 1200.0,
        unlock_security_pin: str = "7492",
        status: str = "IMMOBILIZED_LOCKED",  # IMMOBILIZED_LOCKED | FINE_PAID_RELEASED | TOWED_TO_IMPOUND
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"boot-{uuid.uuid4().hex[:8]}"
        self.boot_code = boot_code
        self.vehicle_plate = vehicle_plate
        self.zone_id = zone_id
        self.violation_reason = violation_reason
        self.fine_amount_inr = fine_amount_inr
        self.unlock_security_pin = unlock_security_pin
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "boot_code": self.boot_code,
            "vehicle_plate": self.vehicle_plate,
            "zone_id": self.zone_id,
            "violation_reason": self.violation_reason,
            "fine_amount_inr": self.fine_amount_inr,
            "unlock_security_pin": self.unlock_security_pin,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class WheelBootRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS wheel_boot_enforcements (
                    id TEXT PRIMARY KEY,
                    boot_code TEXT NOT NULL,
                    vehicle_plate TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    violation_reason TEXT NOT NULL,
                    fine_amount_inr REAL DEFAULT 1200.0,
                    unlock_security_pin TEXT NOT NULL,
                    status TEXT DEFAULT 'IMMOBILIZED_LOCKED',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[WheelBootEnforcement]:
        WheelBootRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM wheel_boot_enforcements ORDER BY created_at DESC")
            return [WheelBootEnforcement(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: WheelBootEnforcement) -> bool:
        WheelBootRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO wheel_boot_enforcements (
                    id, boot_code, vehicle_plate, zone_id,
                    violation_reason, fine_amount_inr,
                    unlock_security_pin, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.boot_code, item.vehicle_plate,
                item.zone_id, item.violation_reason,
                item.fine_amount_inr, item.unlock_security_pin,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

WheelBootRepository.init_table()
