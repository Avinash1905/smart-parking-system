"""
SmartPark Residential Street Parking Permit Repository Layer
Manages neighborhood sticker permits, digital visitor passes, and residency proof verification.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ResidentPermit:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        resident_name: str = "Rahul Sharma",
        neighborhood_zone: str = "Jayanagar 4th Block Residential Zone",
        vehicle_plate: str = "KA-05-AB-1234",
        permit_number: str = "",
        annual_fee: float = 1200.0,
        valid_until: Optional[datetime] = None,
        status: str = "ACTIVE",  # ACTIVE | EXPIRED | PENDING_VERIFICATION
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"res-prm-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.resident_name = resident_name
        self.neighborhood_zone = neighborhood_zone
        self.vehicle_plate = vehicle_plate
        self.permit_number = permit_number or f"RES-BLR-{uuid.uuid4().hex[:6].upper()}"
        self.annual_fee = annual_fee
        self.valid_until = valid_until or datetime.utcnow()
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "resident_name": self.resident_name,
            "neighborhood_zone": self.neighborhood_zone,
            "vehicle_plate": self.vehicle_plate,
            "permit_number": self.permit_number,
            "annual_fee": self.annual_fee,
            "valid_until": self.valid_until.isoformat() if isinstance(self.valid_until, datetime) else self.valid_until,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class ResidentPermitRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS resident_permits (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    resident_name TEXT NOT NULL,
                    neighborhood_zone TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    permit_number TEXT UNIQUE NOT NULL,
                    annual_fee REAL DEFAULT 1200.0,
                    valid_until TEXT,
                    status TEXT DEFAULT 'ACTIVE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(p: ResidentPermit) -> bool:
        ResidentPermitRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO resident_permits (
                    id, user_id, resident_name, neighborhood_zone,
                    vehicle_plate, permit_number, annual_fee, valid_until,
                    status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p.id, p.user_id, p.resident_name, p.neighborhood_zone,
                p.vehicle_plate, p.permit_number, p.annual_fee,
                p.valid_until.isoformat() if isinstance(p.valid_until, datetime) else p.valid_until,
                p.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_by_user(user_id: str) -> List[ResidentPermit]:
        ResidentPermitRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM resident_permits WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            return [ResidentPermit(**dict(r)) for r in cursor.fetchall()]

ResidentPermitRepository.init_table()
