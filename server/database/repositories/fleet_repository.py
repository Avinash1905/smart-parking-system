"""
SmartPark Fleet Logistics & Commercial Loading Dock Repository Layer
Manages commercial vehicle fleets, loading bays, delivery dispatch schedules, and fleet drivers.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FleetVehicle:
    def __init__(
        self,
        id: str = "",
        fleet_operator_id: str = "fleet-amazon-logistics",
        operator_name: str = "Amazon Logistics Fleet",
        vehicle_plate: str = "KA-01-FL-9021",
        vehicle_type: str = "DELIVERY_VAN",  # DELIVERY_VAN | ELECTRIC_TRUCK | CARGO_BIKE
        driver_name: str = "Ramesh Kumar",
        driver_phone: str = "+91 98111 22334",
        assigned_dock_id: Optional[str] = "DOCK-04",
        status: str = "IN_TRANSIT",  # IN_TRANSIT | DOCKED | COMPLETED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"flt-{uuid.uuid4().hex[:8]}"
        self.fleet_operator_id = fleet_operator_id
        self.operator_name = operator_name
        self.vehicle_plate = vehicle_plate
        self.vehicle_type = vehicle_type
        self.driver_name = driver_name
        self.driver_phone = driver_phone
        self.assigned_dock_id = assigned_dock_id
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "fleet_operator_id": self.fleet_operator_id,
            "operator_name": self.operator_name,
            "vehicle_plate": self.vehicle_plate,
            "vehicle_type": self.vehicle_type,
            "driver_name": self.driver_name,
            "driver_phone": self.driver_phone,
            "assigned_dock_id": self.assigned_dock_id,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class FleetRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS fleet_vehicles (
                    id TEXT PRIMARY KEY,
                    fleet_operator_id TEXT NOT NULL,
                    operator_name TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    vehicle_type TEXT DEFAULT 'DELIVERY_VAN',
                    driver_name TEXT NOT NULL,
                    driver_phone TEXT,
                    assigned_dock_id TEXT,
                    status TEXT DEFAULT 'IN_TRANSIT',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(veh: FleetVehicle) -> bool:
        FleetRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO fleet_vehicles (
                    id, fleet_operator_id, operator_name, vehicle_plate,
                    vehicle_type, driver_name, driver_phone, assigned_dock_id,
                    status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                veh.id, veh.fleet_operator_id, veh.operator_name,
                veh.vehicle_plate, veh.vehicle_type, veh.driver_name,
                veh.driver_phone, veh.assigned_dock_id, veh.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_all() -> List[FleetVehicle]:
        FleetRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM fleet_vehicles ORDER BY created_at DESC")
            return [FleetVehicle(**dict(r)) for r in cursor.fetchall()]

FleetRepository.init_table()
