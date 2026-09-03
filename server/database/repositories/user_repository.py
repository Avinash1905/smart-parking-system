"""
SmartPark User Repository Layer
Provides data access operations, query building, filtering, and transactions for User entities.
"""

import sqlite3
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import User

class UserRepository:
    @staticmethod
    def get_by_id(user_id: str) -> Optional[User]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if not row:
                return None
            data = dict(row)
            data["company_verified"] = bool(data["company_verified"])
            data["private_parking_access"] = json.loads(data["private_parking_access"] or "[]")
            return User.from_dict(data)

    @staticmethod
    def get_by_email(email: str) -> Optional[User]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email.lower().strip(),))
            row = cursor.fetchone()
            if not row:
                return None
            data = dict(row)
            data["company_verified"] = bool(data["company_verified"])
            data["private_parking_access"] = json.loads(data["private_parking_access"] or "[]")
            return User.from_dict(data)

    @staticmethod
    def list_all(role: Optional[str] = None, company_id: Optional[str] = None, limit: int = 50, offset: int = 0) -> List[User]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM users WHERE 1=1"
            params = []
            if role:
                query += " AND role = ?"
                params.append(role)
            if company_id:
                query += " AND company_id = ?"
                params.append(company_id)
            query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            cursor.execute(query, params)
            users = []
            for row in cursor.fetchall():
                data = dict(row)
                data["company_verified"] = bool(data["company_verified"])
                data["private_parking_access"] = json.loads(data["private_parking_access"] or "[]")
                users.append(User.from_dict(data))
            return users

    @staticmethod
    def create(user: User) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO users (
                    id, name, email, password_hash, role, company_id, company_name,
                    employee_id, company_verified, phone, avatar_initials, status,
                    private_parking_access, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user.id, user.name, user.email, user.password_hash, user.role,
                user.company_id, user.company_name, user.employee_id,
                1 if user.company_verified else 0, user.phone, user.avatar_initials,
                user.status, json.dumps(user.private_parking_access or []),
                now_iso, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def update_profile(user_id: str, updates: Dict[str, Any]) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            allowed_fields = ["name", "phone", "avatar_initials", "company_id", "company_name", "employee_id"]
            set_clauses = []
            params = []
            for k, v in updates.items():
                if k in allowed_fields:
                    set_clauses.append(f"{k} = ?")
                    params.append(v)
            if not set_clauses:
                return False
            set_clauses.append("updated_at = ?")
            params.append(datetime.utcnow().isoformat())
            params.append(user_id)

            query = f"UPDATE users SET {', '.join(set_clauses)} WHERE id = ?"
            cursor.execute(query, params)
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def update_access_list(user_id: str, access_zones: List[str]) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                UPDATE users 
                SET private_parking_access = ?, updated_at = ?
                WHERE id = ?
            """, (json.dumps(access_zones), now_iso, user_id))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def update_password(user_id: str, new_password_hash: str) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                UPDATE users 
                SET password_hash = ?, updated_at = ?
                WHERE id = ?
            """, (new_password_hash, now_iso, user_id))
            conn.commit()
            return cursor.rowcount > 0
