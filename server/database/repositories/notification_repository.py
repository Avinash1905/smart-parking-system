"""
SmartPark Notification & In-App Alert Repository Layer
Manages user push alerts, unread counts, and direct action triggers.
"""

import sqlite3
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import Notification

class NotificationRepository:
    @staticmethod
    def list_by_user(user_id: str, unread_only: bool = False, limit: int = 30) -> List[Notification]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM notifications WHERE user_id = ?"
            params = [user_id]
            if unread_only:
                query += " AND is_read = 0"
            query += " ORDER BY created_at DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            notifs = []
            for row in cursor.fetchall():
                d = dict(row)
                d["is_read"] = bool(d["is_read"])
                notifs.append(Notification.from_dict(d))
            return notifs

    @staticmethod
    def create(n: Notification) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO notifications (
                    id, user_id, title, message, notification_type, is_read, action_url, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                n.id, n.user_id, n.title, n.message, n.notification_type,
                1 if n.is_read else 0, n.action_url, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def mark_all_read(user_id: str) -> int:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE notifications SET is_read = 1 WHERE user_id = ?", (user_id,))
            conn.commit()
            return cursor.rowcount
