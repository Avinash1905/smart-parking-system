"""
SmartPark Vehicle Rear Bumper Overhang & Tail Clearance Laser Curtain Repository Layer
Manages infrared laser curtain arrays measuring vehicle rear overhang encroachment (cm) into pedestrian sidewalks and drive aisles.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TailClearanceNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "TAIL-OVERHANG-LASER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Stall A-04 Aisle Boundary",
        vehicle_plate: str = "KA-01-EQ-9988",
        tail_overhang_encroachment_cm: float = 4.2,  # Encroachment limit < 15.0 cm
        allowable_encroachment_limit_cm: float = 15.0,
        drive_aisle_width_retained_meters: float = 6.85,
        overhang_violation_status: str = "TAIL_PARKED_WITHIN_PERIMETER",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"tcn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.vehicle_plate = vehicle_plate
        self.tail_overhang_encroachment_cm = tail_overhang_encroachment_cm
        self.allowable_encroachment_limit_cm = allowable_encroachment_limit_cm
        self.drive_aisle_width_retained_meters = drive_aisle_width_retained_meters
        self.overhang_violation_status = overhang_violation_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "vehicle_plate": self.vehicle_plate,
            "tail_overhang_encroachment_cm": self.tail_overhang_encroachment_cm,
            "allowable_encroachment_limit_cm": self.allowable_encroachment_limit_cm,
            "drive_aisle_width_retained_meters": self.drive_aisle_width_retained_meters,
            "overhang_violation_status": self.overhang_violation_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class TailClearanceRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tail_clearance_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    tail_overhang_encroachment_cm REAL DEFAULT 4.2,
                    allowable_encroachment_limit_cm REAL DEFAULT 15.0,
                    drive_aisle_width_retained_meters REAL DEFAULT 6.85,
                    overhang_violation_status TEXT DEFAULT 'TAIL_PARKED_WITHIN_PERIMETER',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> TailClearanceNode:
        TailClearanceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tail_clearance_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return TailClearanceNode(**dict(row))
            node = TailClearanceNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO tail_clearance_nodes (
                    id, sensor_code, zone_id, floor_level,
                    vehicle_plate, tail_overhang_encroachment_cm,
                    allowable_encroachment_limit_cm,
                    drive_aisle_width_retained_meters,
                    overhang_violation_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.vehicle_plate, node.tail_overhang_encroachment_cm,
                node.allowable_encroachment_limit_cm,
                node.drive_aisle_width_retained_meters,
                node.overhang_violation_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

TailClearanceRepository.init_table()
