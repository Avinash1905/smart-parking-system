"""
SmartPark Corporate Visitor Pre-Clearance & Host Approval Repository Layer
Manages visitor invites, corporate host approvals (TCS/Infosys/Wipro), and digital entrance QR passes.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class VisitorPreclearance:
    def __init__(
        self,
        id: str = "",
        pass_code: str = "VIS-TCS-9021",
        host_user_id: str = "usr-tcs-01",
        host_name: str = "Avinash Sharma (TCS)",
        visitor_name: str = "Rajesh Gupta",
        visitor_email: str = "rajesh.g@client.com",
        visitor_vehicle_plate: str = "KA-03-HA-8822",
        destination_deck_id: str = "zone-pvt-01",
        visit_scheduled_time: str = "Tomorrow, 10:00 AM",
        nda_signed: bool = True,
        approval_status: str = "APPROVED_HOST_VERIFIED",  # PENDING_HOST_APPROVAL | APPROVED_HOST_VERIFIED | EXPIRED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"vis-{uuid.uuid4().hex[:8]}"
        self.pass_code = pass_code
        self.host_user_id = host_user_id
        self.host_name = host_name
        self.visitor_name = visitor_name
        self.visitor_email = visitor_email
        self.visitor_vehicle_plate = visitor_vehicle_plate
        self.destination_deck_id = destination_deck_id
        self.visit_scheduled_time = visit_scheduled_time
        self.nda_signed = nda_signed
        self.approval_status = approval_status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "pass_code": self.pass_code,
            "host_user_id": self.host_user_id,
            "host_name": self.host_name,
            "visitor_name": self.visitor_name,
            "visitor_email": self.visitor_email,
            "visitor_vehicle_plate": self.visitor_vehicle_plate,
            "destination_deck_id": self.destination_deck_id,
            "visit_scheduled_time": self.visit_scheduled_time,
            "nda_signed": self.nda_signed,
            "approval_status": self.approval_status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class VisitorPreclearanceRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS visitor_preclearances (
                    id TEXT PRIMARY KEY,
                    pass_code TEXT UNIQUE NOT NULL,
                    host_user_id TEXT NOT NULL,
                    host_name TEXT NOT NULL,
                    visitor_name TEXT NOT NULL,
                    visitor_email TEXT NOT NULL,
                    visitor_vehicle_plate TEXT NOT NULL,
                    destination_deck_id TEXT NOT NULL,
                    visit_scheduled_time TEXT NOT NULL,
                    nda_signed INTEGER DEFAULT 1,
                    approval_status TEXT DEFAULT 'APPROVED_HOST_VERIFIED',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[VisitorPreclearance]:
        VisitorPreclearanceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM visitor_preclearances ORDER BY created_at DESC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["nda_signed"] = bool(d["nda_signed"])
                res.append(VisitorPreclearance(**d))
            return res

    @staticmethod
    def create(item: VisitorPreclearance) -> bool:
        VisitorPreclearanceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO visitor_preclearances (
                    id, pass_code, host_user_id, host_name,
                    visitor_name, visitor_email, visitor_vehicle_plate,
                    destination_deck_id, visit_scheduled_time,
                    nda_signed, approval_status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.pass_code, item.host_user_id, item.host_name,
                item.visitor_name, item.visitor_email, item.visitor_vehicle_plate,
                item.destination_deck_id, item.visit_scheduled_time,
                1 if item.nda_signed else 0, item.approval_status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

VisitorPreclearanceRepository.init_table()
