"""
SmartPark Favorites & Saved Parking Facilities Repository Layer
Manages driver bookmarks, custom facility nicknames (e.g. Workplace, Gym, Weekend Mall), and quick-rebook shortcuts.
"""

import sqlite3
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import FavoriteParking

class FavoriteRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS favorites (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    zone_name TEXT,
                    nickname TEXT DEFAULT 'Saved Location',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_by_user(user_id: str) -> List[FavoriteParking]:
        FavoriteRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            return [FavoriteParking(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def add(user_id: str, zone_id: str, zone_name: str, nickname: str = "Saved Location") -> bool:
        FavoriteRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            # Check if already exists
            cursor.execute("SELECT id FROM favorites WHERE user_id = ? AND zone_id = ?", (user_id, zone_id))
            if cursor.fetchone():
                return False
            cursor.execute("""
                INSERT INTO favorites (id, user_id, zone_id, zone_name, nickname, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (f"fav-{uuid.uuid4().hex[:8]}", user_id, zone_id, zone_name, nickname, datetime.utcnow().isoformat()))
            conn.commit()
            return True

    @staticmethod
    def remove(user_id: str, zone_id: str) -> bool:
        FavoriteRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM favorites WHERE user_id = ? AND zone_id = ?", (user_id, zone_id))
            conn.commit()
            return cursor.rowcount > 0

FavoriteRepository.init_table()
