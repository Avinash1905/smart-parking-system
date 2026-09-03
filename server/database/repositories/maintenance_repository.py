"""
SmartPark Maintenance Work-Order & Facility Operations Repository Layer
Manages preventive maintenance tasks, technician work orders, boom barrier motor replacements, and repair logs.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class MaintenanceWorkOrder:
    def __init__(
        self,
        id: str = "",
        work_order_code: str = "WO-8821",
        zone_id: str = "zone-pub-01",
        zone_name: str = "Municipal Central Parking",
        asset_type: str = "BOOM_BARRIER_MOTOR",  # BOOM_BARRIER_MOTOR | ULTRASONIC_STUD | EV_CHARGER_CABLE | LINE_PAINT
        priority: str = "HIGH",  # LOW | MEDIUM | HIGH | CRITICAL
        description: str = "North Gate entry barrier motor replacement.",
        assigned_technician: str = "Ravi Teja (Tech #4)",
        estimated_cost: float = 4500.0,
        status: str = "IN_PROGRESS",  # OPEN | IN_PROGRESS | COMPLETED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"wo-{uuid.uuid4().hex[:8]}"
        self.work_order_code = work_order_code
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.asset_type = asset_type
        self.priority = priority
        self.description = description
        self.assigned_technician = assigned_technician
        self.estimated_cost = estimated_cost
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "work_order_code": self.work_order_code,
            "zone_id": self.zone_id,
            "zone_name": self.zone_name,
            "asset_type": self.asset_type,
            "priority": self.priority,
            "description": self.description,
            "assigned_technician": self.assigned_technician,
            "estimated_cost": self.estimated_cost,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class MaintenanceRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS maintenance_work_orders (
                    id TEXT PRIMARY KEY,
                    work_order_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    zone_name TEXT NOT NULL,
                    asset_type TEXT NOT NULL,
                    priority TEXT DEFAULT 'HIGH',
                    description TEXT NOT NULL,
                    assigned_technician TEXT NOT NULL,
                    estimated_cost REAL DEFAULT 4500.0,
                    status TEXT DEFAULT 'IN_PROGRESS',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(wo: MaintenanceWorkOrder) -> bool:
        MaintenanceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO maintenance_work_orders (
                    id, work_order_code, zone_id, zone_name, asset_type,
                    priority, description, assigned_technician,
                    estimated_cost, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                wo.id, wo.work_order_code, wo.zone_id, wo.zone_name,
                wo.asset_type, wo.priority, wo.description,
                wo.assigned_technician, wo.estimated_cost,
                wo.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_all() -> List[MaintenanceWorkOrder]:
        MaintenanceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM maintenance_work_orders ORDER BY created_at DESC")
            return [MaintenanceWorkOrder(**dict(r)) for r in cursor.fetchall()]

MaintenanceRepository.init_table()
