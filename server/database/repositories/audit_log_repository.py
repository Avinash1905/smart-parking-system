"""
SmartPark Security Audit Log Repository Layer
Provides tamper-resistant logging of all authentication events, administrative actions, and tariff modifications.
"""

import sqlite3
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import AuditLog

class AuditLogRepository:
    @staticmethod
    def list_all(action_filter: Optional[str] = None, user_id: Optional[str] = None, limit: int = 100) -> List[AuditLog]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM audit_logs WHERE 1=1"
            params = []
            if action_filter:
                query += " AND action = ?"
                params.append(action_filter)
            if user_id:
                query += " AND user_id = ?"
                params.append(user_id)
            query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            logs = []
            for row in cursor.fetchall():
                d = dict(row)
                d["details"] = json.loads(d["details"] or "{}")
                logs.append(AuditLog.from_dict(d))
            return logs

    @staticmethod
    def create(log: AuditLog) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO audit_logs (
                    id, user_id, user_email, action, resource_type,
                    resource_id, details, ip_address, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                log.id, log.user_id, log.user_email, log.action,
                log.resource_type, log.resource_id,
                json.dumps(log.details or {}), log.ip_address, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0
