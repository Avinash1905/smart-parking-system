"""
SmartPark Vehicle Inspection & Pre-Entry Damage Logger Repository Layer
Logs automated 360-degree camera vehicle surface scans upon gate entry to protect operators and drivers.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class VehicleInspectionScan:
    def __init__(
        self,
        id: str = "",
        reservation_id: str = "RES-A2401",
        vehicle_plate: str = "KA-01-MJ-5890",
        zone_id: str = "zone-pub-01",
        front_bumper_status: str = "CLEAN",
        rear_bumper_status: str = "CLEAN",
        left_side_panel_status: str = "MINOR_SURFACE_SCRATCH",
        right_side_panel_status: str = "CLEAN",
        camera_scan_resolution: str = "4K_HDR",
        scan_timestamp: Optional[datetime] = None
    ):
        self.id = id or f"scan-{uuid.uuid4().hex[:8]}"
        self.reservation_id = reservation_id
        self.vehicle_plate = vehicle_plate
        self.zone_id = zone_id
        self.front_bumper_status = front_bumper_status
        self.rear_bumper_status = rear_bumper_status
        self.left_side_panel_status = left_side_panel_status
        self.right_side_panel_status = right_side_panel_status
        self.camera_scan_resolution = camera_scan_resolution
        self.scan_timestamp = scan_timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "reservation_id": self.reservation_id,
            "vehicle_plate": self.vehicle_plate,
            "zone_id": self.zone_id,
            "front_bumper_status": self.front_bumper_status,
            "rear_bumper_status": self.rear_bumper_status,
            "left_side_panel_status": self.left_side_panel_status,
            "right_side_panel_status": self.right_side_panel_status,
            "camera_scan_resolution": self.camera_scan_resolution,
            "scan_timestamp": self.scan_timestamp.isoformat() if isinstance(self.scan_timestamp, datetime) else self.scan_timestamp
        }

class InspectionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vehicle_inspections (
                    id TEXT PRIMARY KEY,
                    reservation_id TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    front_bumper_status TEXT DEFAULT 'CLEAN',
                    rear_bumper_status TEXT DEFAULT 'CLEAN',
                    left_side_panel_status TEXT DEFAULT 'CLEAN',
                    right_side_panel_status TEXT DEFAULT 'CLEAN',
                    camera_scan_resolution TEXT DEFAULT '4K_HDR',
                    scan_timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(scan: VehicleInspectionScan) -> bool:
        InspectionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO vehicle_inspections (
                    id, reservation_id, vehicle_plate, zone_id,
                    front_bumper_status, rear_bumper_status,
                    left_side_panel_status, right_side_panel_status,
                    camera_scan_resolution, scan_timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                scan.id, scan.reservation_id, scan.vehicle_plate, scan.zone_id,
                scan.front_bumper_status, scan.rear_bumper_status,
                scan.left_side_panel_status, scan.right_side_panel_status,
                scan.camera_scan_resolution, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def get_by_reservation(res_id: str) -> Optional[VehicleInspectionScan]:
        InspectionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM vehicle_inspections WHERE reservation_id = ?", (res_id,))
            row = cursor.fetchone()
            return VehicleInspectionScan(**dict(row)) if row else None

InspectionRepository.init_table()
