"""
SmartPark Company & Corporate Partner Repository Layer
Manages enterprise client directories, partner codes, domains, and affiliated decks.
"""

import sqlite3
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import Company

class CompanyRepository:
    @staticmethod
    def get_by_id(company_id: str) -> Optional[Company]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM companies WHERE id = ?", (company_id,))
            row = cursor.fetchone()
            return Company.from_dict(dict(row)) if row else None

    @staticmethod
    def get_by_code(code: str) -> Optional[Company]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM companies WHERE UPPER(code) = ?", (code.upper().strip(),))
            row = cursor.fetchone()
            return Company.from_dict(dict(row)) if row else None

    @staticmethod
    def list_all() -> List[Company]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM companies WHERE status = 'ACTIVE' ORDER BY name ASC")
            return [Company.from_dict(dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(c: Company) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO companies (
                    id, name, code, headquarters, description, domain,
                    total_employees, active_parking_zones, contact_email,
                    contact_phone, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                c.id, c.name, c.code.upper(), c.headquarters, c.description,
                c.domain, c.total_employees, c.active_parking_zones,
                c.contact_email, c.contact_phone, c.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0
