"""
SmartPark Automated Valet & Robotic Conveyor Repository Layer
Manages digital valet tickets, robotic automated storage retrieval stalls (ASRS), and key locker codes.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ValetTicket:
    def __init__(
        self,
        id: str = "",
        ticket_code: str = "",
        user_id: str = "",
        user_name: str = "Driver",
        vehicle_plate: str = "KA-01-MJ-5890",
        zone_id: str = "zone-pub-01",
        zone_name: str = "Municipal Central Parking",
        robotic_stall_id: str = "ROBOTIC-BAY-44",
        key_locker_code: str = "8921",
        drop_off_time: Optional[datetime] = None,
        retrieval_request_time: Optional[datetime] = None,
        status: str = "PARKED"  # PARKED | RETRIEVAL_REQUESTED | READY_FOR_PICKUP | COMPLETED
    ):
        self.id = id or f"val-{uuid.uuid4().hex[:8]}"
        self.ticket_code = ticket_code or f"VALET-{uuid.uuid4().hex[:6].upper()}"
        self.user_id = user_id
        self.user_name = user_name
        self.vehicle_plate = vehicle_plate
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.robotic_stall_id = robotic_stall_id
        self.key_locker_code = key_locker_code
        self.drop_off_time = drop_off_time or datetime.utcnow()
        self.retrieval_request_time = retrieval_request_time
        self.status = status

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "ticket_code": self.ticket_code,
            "user_id": self.user_id,
            "user_name": self.user_name,
            "vehicle_plate": self.vehicle_plate,
            "zone_id": self.zone_id,
            "zone_name": self.zone_name,
            "robotic_stall_id": self.robotic_stall_id,
            "key_locker_code": self.key_locker_code,
            "drop_off_time": self.drop_off_time.isoformat() if isinstance(self.drop_off_time, datetime) else self.drop_off_time,
            "retrieval_request_time": self.retrieval_request_time.isoformat() if isinstance(self.retrieval_request_time, datetime) and self.retrieval_request_time else None,
            "status": self.status
        }

class ValetRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS valet_tickets (
                    id TEXT PRIMARY KEY,
                    ticket_code TEXT UNIQUE NOT NULL,
                    user_id TEXT NOT NULL,
                    user_name TEXT,
                    vehicle_plate TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    zone_name TEXT,
                    robotic_stall_id TEXT NOT NULL,
                    key_locker_code TEXT NOT NULL,
                    drop_off_time TEXT,
                    retrieval_request_time TEXT,
                    status TEXT DEFAULT 'PARKED'
                )
            """)
            conn.commit()

    @staticmethod
    def create(v: ValetTicket) -> bool:
        ValetRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO valet_tickets (
                    id, ticket_code, user_id, user_name, vehicle_plate,
                    zone_id, zone_name, robotic_stall_id, key_locker_code,
                    drop_off_time, retrieval_request_time, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                v.id, v.ticket_code, v.user_id, v.user_name, v.vehicle_plate,
                v.zone_id, v.zone_name, v.robotic_stall_id, v.key_locker_code,
                now_iso, None, v.status
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_by_user(user_id: str) -> List[ValetTicket]:
        ValetRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM valet_tickets WHERE user_id = ? ORDER BY drop_off_time DESC", (user_id,))
            return [ValetTicket(**dict(r)) for r in cursor.fetchall()]

ValetRepository.init_table()
