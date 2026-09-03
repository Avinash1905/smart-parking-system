"""
SmartPark Support Ticket & Driver Helpdesk Repository Layer
Manages customer support queries, barrier emergency lift requests, and driver assistance tickets.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SupportTicket:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        user_name: str = "Driver",
        user_email: str = "",
        subject: str = "",
        category: str = "GATE_BARRIER_ISSUE",  # GATE_BARRIER_ISSUE | PAYMENT_DISPUTE | WRONG_SLOT | EV_CHARGER_FAULT
        priority: str = "HIGH",  # LOW | MEDIUM | HIGH | URGENT
        description: str = "",
        status: str = "OPEN",  # OPEN | IN_PROGRESS | RESOLVED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"TICK-{uuid.uuid4().hex[:6].upper()}"
        self.user_id = user_id
        self.user_name = user_name
        self.user_email = user_email
        self.subject = subject
        self.category = category
        self.priority = priority
        self.description = description
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user_name,
            "user_email": self.user_email,
            "subject": self.subject,
            "category": self.category,
            "priority": self.priority,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class SupportTicketRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS support_tickets (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    user_name TEXT,
                    user_email TEXT,
                    subject TEXT NOT NULL,
                    category TEXT DEFAULT 'GATE_BARRIER_ISSUE',
                    priority TEXT DEFAULT 'HIGH',
                    description TEXT NOT NULL,
                    status TEXT DEFAULT 'OPEN',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(t: SupportTicket) -> bool:
        SupportTicketRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO support_tickets (
                    id, user_id, user_name, user_email, subject,
                    category, priority, description, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                t.id, t.user_id, t.user_name, t.user_email, t.subject,
                t.category, t.priority, t.description, t.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_all(status: Optional[str] = None) -> List[SupportTicket]:
        SupportTicketRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM support_tickets WHERE 1=1"
            params = []
            if status and status != "ALL":
                query += " AND status = ?"
                params.append(status)
            query += " ORDER BY created_at DESC"

            cursor.execute(query, params)
            return [SupportTicket(**dict(r)) for r in cursor.fetchall()]

SupportTicketRepository.init_table()
