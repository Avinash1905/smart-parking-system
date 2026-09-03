"""
SmartPark Employee & Corporate Whitelist Repository Layer
Provides data access, filtering, RFID badge assignments, and department quotas.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class Employee:
    def __init__(
        self,
        id: str = "",
        company_id: str = "",
        company_name: str = "",
        user_id: Optional[str] = None,
        name: str = "",
        email: str = "",
        employee_code: str = "",
        department: str = "Engineering",
        rfid_badge_id: str = "",
        vehicle_plate: str = "",
        allocated_zone_id: str = "zone-pvt-01",
        access_tier: str = "FULL_ACCESS",  # FULL_ACCESS | HYBRID_DAYS | EXECUTIVE | VISITOR
        clearance_status: str = "ACTIVE",   # ACTIVE | SUSPENDED | PENDING_APPROVAL
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"emp-{uuid.uuid4().hex[:8]}"
        self.company_id = company_id
        self.company_name = company_name
        self.user_id = user_id
        self.name = name
        self.email = email.lower().strip()
        self.employee_code = employee_code.upper().strip()
        self.department = department
        self.rfid_badge_id = rfid_badge_id or f"RFID-{uuid.uuid4().hex[:8].upper()}"
        self.vehicle_plate = vehicle_plate.upper().strip()
        self.allocated_zone_id = allocated_zone_id
        self.access_tier = access_tier
        self.clearance_status = clearance_status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "company_id": self.company_id,
            "company_name": self.company_name,
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "employee_code": self.employee_code,
            "department": self.department,
            "rfid_badge_id": self.rfid_badge_id,
            "vehicle_plate": self.vehicle_plate,
            "allocated_zone_id": self.allocated_zone_id,
            "access_tier": self.access_tier,
            "clearance_status": self.clearance_status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class EmployeeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS employees (
                    id TEXT PRIMARY KEY,
                    company_id TEXT NOT NULL,
                    company_name TEXT NOT NULL,
                    user_id TEXT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    employee_code TEXT NOT NULL,
                    department TEXT DEFAULT 'Engineering',
                    rfid_badge_id TEXT UNIQUE NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    allocated_zone_id TEXT,
                    access_tier TEXT DEFAULT 'FULL_ACCESS',
                    clearance_status TEXT DEFAULT 'ACTIVE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_by_id(emp_id: str) -> Optional[Employee]:
        EmployeeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
            row = cursor.fetchone()
            return Employee(**dict(row)) if row else None

    @staticmethod
    def get_by_email(email: str) -> Optional[Employee]:
        EmployeeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM employees WHERE LOWER(email) = ?", (email.lower().strip(),))
            row = cursor.fetchone()
            return Employee(**dict(row)) if row else None

    @staticmethod
    def list_by_company(company_id: str, department: Optional[str] = None, limit: int = 50) -> List[Employee]:
        EmployeeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM employees WHERE company_id = ?"
            params = [company_id]
            if department:
                query += " AND department = ?"
                params.append(department)
            query += " ORDER BY name ASC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            return [Employee(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(emp: Employee) -> bool:
        EmployeeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO employees (
                    id, company_id, company_name, user_id, name, email,
                    employee_code, department, rfid_badge_id, vehicle_plate,
                    allocated_zone_id, access_tier, clearance_status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                emp.id, emp.company_id, emp.company_name, emp.user_id,
                emp.name, emp.email, emp.employee_code, emp.department,
                emp.rfid_badge_id, emp.vehicle_plate, emp.allocated_zone_id,
                emp.access_tier, emp.clearance_status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def update_status(emp_id: str, new_status: str) -> bool:
        EmployeeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE employees SET clearance_status = ? WHERE id = ?", (new_status, emp_id))
            conn.commit()
            return cursor.rowcount > 0

EmployeeRepository.init_table()
