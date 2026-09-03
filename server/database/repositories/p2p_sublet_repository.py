"""
SmartPark P2P (Peer-to-Peer) Shared Driveway & Sublet Repository Layer
Enables private homeowners to list their driveway spots during work hours and earn passive income.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class P2PListing:
    def __init__(
        self,
        id: str = "",
        host_user_id: str = "",
        host_name: str = "Priya V.",
        title: str = "Covered Gated Driveway near Indiranagar Metro",
        address: str = "12th Main, HAL 2nd Stage, Indiranagar",
        hourly_rate: float = 25.0,
        available_days: str = "MON,TUE,WED,THU,FRI",
        available_time_window: str = "09:00 AM - 06:00 PM",
        is_ev_charger_equipped: bool = True,
        status: str = "ACTIVE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"p2p-{uuid.uuid4().hex[:8]}"
        self.host_user_id = host_user_id
        self.host_name = host_name
        self.title = title
        self.address = address
        self.hourly_rate = hourly_rate
        self.available_days = available_days
        self.available_time_window = available_time_window
        self.is_ev_charger_equipped = is_ev_charger_equipped
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "host_user_id": self.host_user_id,
            "host_name": self.host_name,
            "title": self.title,
            "address": self.address,
            "hourly_rate": self.hourly_rate,
            "available_days": self.available_days,
            "available_time_window": self.available_time_window,
            "is_ev_charger_equipped": self.is_ev_charger_equipped,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class P2PSubletRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS p2p_listings (
                    id TEXT PRIMARY KEY,
                    host_user_id TEXT NOT NULL,
                    host_name TEXT NOT NULL,
                    title TEXT NOT NULL,
                    address TEXT NOT NULL,
                    hourly_rate REAL DEFAULT 25.0,
                    available_days TEXT DEFAULT 'MON,TUE,WED,THU,FRI',
                    available_time_window TEXT DEFAULT '09:00 AM - 06:00 PM',
                    is_ev_charger_equipped INTEGER DEFAULT 1,
                    status TEXT DEFAULT 'ACTIVE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(item: P2PListing) -> bool:
        P2PSubletRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO p2p_listings (
                    id, host_user_id, host_name, title, address,
                    hourly_rate, available_days, available_time_window,
                    is_ev_charger_equipped, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.host_user_id, item.host_name, item.title,
                item.address, item.hourly_rate, item.available_days,
                item.available_time_window, 1 if item.is_ev_charger_equipped else 0,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_all() -> List[P2PListing]:
        P2PSubletRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM p2p_listings ORDER BY created_at DESC")
            items = []
            for r in cursor.fetchall():
                d = dict(r)
                d["is_ev_charger_equipped"] = bool(d["is_ev_charger_equipped"])
                items.append(P2PListing(**d))
            return items

P2PSubletRepository.init_table()
