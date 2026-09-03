"""
SmartPark Tire Tread Depth & Wear Laser Scanner Repository Layer
Manages 3D drive-over optical laser scanners measuring tire groove millimeter depths (6.5mm safe, <1.6mm legal minimum).
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TireTreadScanRecord:
    def __init__(
        self,
        id: str = "",
        scan_code: str = "TREAD-SCAN-482",
        vehicle_plate: str = "KA-01-MJ-5890",
        zone_id: str = "zone-pub-01",
        front_left_depth_mm: float = 6.4,
        front_right_depth_mm: float = 6.2,
        rear_left_depth_mm: float = 5.8,
        rear_right_depth_mm: float = 5.9,
        minimum_depth_detected_mm: float = 5.8,
        tire_safety_verdict: str = "EXCELLENT_GRIP",  # EXCELLENT_GRIP | GOOD_TRACTION | WARNING_WEAR | CRITICAL_REPLACE
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"trd-{uuid.uuid4().hex[:8]}"
        self.scan_code = scan_code
        self.vehicle_plate = vehicle_plate
        self.zone_id = zone_id
        self.front_left_depth_mm = front_left_depth_mm
        self.front_right_depth_mm = front_right_depth_mm
        self.rear_left_depth_mm = rear_left_depth_mm
        self.rear_right_depth_mm = rear_right_depth_mm
        self.minimum_depth_detected_mm = minimum_depth_detected_mm
        self.tire_safety_verdict = tire_safety_verdict
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "scan_code": self.scan_code,
            "vehicle_plate": self.vehicle_plate,
            "zone_id": self.zone_id,
            "front_left_depth_mm": self.front_left_depth_mm,
            "front_right_depth_mm": self.front_right_depth_mm,
            "rear_left_depth_mm": self.rear_left_depth_mm,
            "rear_right_depth_mm": self.rear_right_depth_mm,
            "minimum_depth_detected_mm": self.minimum_depth_detected_mm,
            "tire_safety_verdict": self.tire_safety_verdict,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class TireTreadRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tire_tread_scan_records (
                    id TEXT PRIMARY KEY,
                    scan_code TEXT UNIQUE NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    front_left_depth_mm REAL DEFAULT 6.4,
                    front_right_depth_mm REAL DEFAULT 6.2,
                    rear_left_depth_mm REAL DEFAULT 5.8,
                    rear_right_depth_mm REAL DEFAULT 5.9,
                    minimum_depth_detected_mm REAL DEFAULT 5.8,
                    tire_safety_verdict TEXT DEFAULT 'EXCELLENT_GRIP',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_by_plate(plate: str) -> Optional[TireTreadScanRecord]:
        TireTreadRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tire_tread_scan_records WHERE UPPER(vehicle_plate) = ? ORDER BY timestamp DESC LIMIT 1", (plate.upper().strip(),))
            row = cursor.fetchone()
            if row:
                return TireTreadScanRecord(**dict(row))
            rec = TireTreadScanRecord(vehicle_plate=plate)
            cursor.execute("""
                INSERT INTO tire_tread_scan_records (
                    id, scan_code, vehicle_plate, zone_id,
                    front_left_depth_mm, front_right_depth_mm,
                    rear_left_depth_mm, rear_right_depth_mm,
                    minimum_depth_detected_mm, tire_safety_verdict,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                rec.id, rec.scan_code, rec.vehicle_plate, rec.zone_id,
                rec.front_left_depth_mm, rec.front_right_depth_mm,
                rec.rear_left_depth_mm, rec.rear_right_depth_mm,
                rec.minimum_depth_detected_mm, rec.tire_safety_verdict,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return rec

TireTreadRepository.init_table()
