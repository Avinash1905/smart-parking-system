"""
SmartPark Elevator & Vertical Mobility Predictive Health Repository Layer
Manages cabin floor leveling millimeter tolerance, traction rope vibration, door cycle counters, and preventive maintenance flags.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ElevatorHealthNode:
    def __init__(
        self,
        id: str = "",
        elevator_code: str = "ELEV-TRACTION-01",
        zone_id: str = "zone-pub-01",
        location_label: str = "North Core Passenger Elevator",
        current_floor: str = "Floor G",
        door_open_cycles_total: int = 42890,
        floor_leveling_error_mm: float = 1.2,
        hoist_rope_vibration_mm_s: float = 0.28,
        drive_motor_temp_celsius: float = 42.1,
        maintenance_status: str = "HEALTHY_OPTIMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"elv-{uuid.uuid4().hex[:8]}"
        self.elevator_code = elevator_code
        self.zone_id = zone_id
        self.location_label = location_label
        self.current_floor = current_floor
        self.door_open_cycles_total = door_open_cycles_total
        self.floor_leveling_error_mm = floor_leveling_error_mm
        self.hoist_rope_vibration_mm_s = hoist_rope_vibration_mm_s
        self.drive_motor_temp_celsius = drive_motor_temp_celsius
        self.maintenance_status = maintenance_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "elevator_code": self.elevator_code,
            "zone_id": self.zone_id,
            "location_label": self.location_label,
            "current_floor": self.current_floor,
            "door_open_cycles_total": self.door_open_cycles_total,
            "floor_leveling_error_mm": self.floor_leveling_error_mm,
            "hoist_rope_vibration_mm_s": self.hoist_rope_vibration_mm_s,
            "drive_motor_temp_celsius": self.drive_motor_temp_celsius,
            "maintenance_status": self.maintenance_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ElevatorHealthRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS elevator_health_nodes (
                    id TEXT PRIMARY KEY,
                    elevator_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    location_label TEXT NOT NULL,
                    current_floor TEXT NOT NULL,
                    door_open_cycles_total INTEGER DEFAULT 42890,
                    floor_leveling_error_mm REAL DEFAULT 1.2,
                    hoist_rope_vibration_mm_s REAL DEFAULT 0.28,
                    drive_motor_temp_celsius REAL DEFAULT 42.1,
                    maintenance_status TEXT DEFAULT 'HEALTHY_OPTIMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[ElevatorHealthNode]:
        ElevatorHealthRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM elevator_health_nodes ORDER BY elevator_code ASC")
            return [ElevatorHealthNode(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: ElevatorHealthNode) -> bool:
        ElevatorHealthRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO elevator_health_nodes (
                    id, elevator_code, zone_id, location_label,
                    current_floor, door_open_cycles_total,
                    floor_leveling_error_mm, hoist_rope_vibration_mm_s,
                    drive_motor_temp_celsius, maintenance_status,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.elevator_code, item.zone_id,
                item.location_label, item.current_floor,
                item.door_open_cycles_total,
                item.floor_leveling_error_mm,
                item.hoist_rope_vibration_mm_s,
                item.drive_motor_temp_celsius,
                item.maintenance_status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

ElevatorHealthRepository.init_table()
