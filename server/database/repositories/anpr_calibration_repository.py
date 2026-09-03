"""
SmartPark ANPR Lens Calibration & Optical Benchmarks Repository Layer
Tracks camera shutter speeds (1/1000s), infrared strobe power, and optical character accuracy metrics.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ANPRCalibrationNode:
    def __init__(
        self,
        id: str = "",
        camera_id: str = "CAM-NORTH-01",
        zone_id: str = "zone-pub-01",
        shutter_speed_microseconds: int = 1000,
        ir_illumination_level_pct: int = 85,
        target_focal_length_mm: float = 16.0,
        ocr_accuracy_rate_pct: float = 99.4,
        speed_capture_limit_kmh: int = 60,
        status: str = "CALIBRATED_OPTIMAL",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"cal-{uuid.uuid4().hex[:8]}"
        self.camera_id = camera_id
        self.zone_id = zone_id
        self.shutter_speed_microseconds = shutter_speed_microseconds
        self.ir_illumination_level_pct = ir_illumination_level_pct
        self.target_focal_length_mm = target_focal_length_mm
        self.ocr_accuracy_rate_pct = ocr_accuracy_rate_pct
        self.speed_capture_limit_kmh = speed_capture_limit_kmh
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "camera_id": self.camera_id,
            "zone_id": self.zone_id,
            "shutter_speed_microseconds": self.shutter_speed_microseconds,
            "ir_illumination_level_pct": self.ir_illumination_level_pct,
            "target_focal_length_mm": self.target_focal_length_mm,
            "ocr_accuracy_rate_pct": self.ocr_accuracy_rate_pct,
            "speed_capture_limit_kmh": self.speed_capture_limit_kmh,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class ANPRCalibrationRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS anpr_calibrations (
                    id TEXT PRIMARY KEY,
                    camera_id TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    shutter_speed_microseconds INTEGER DEFAULT 1000,
                    ir_illumination_level_pct INTEGER DEFAULT 85,
                    target_focal_length_mm REAL DEFAULT 16.0,
                    ocr_accuracy_rate_pct REAL DEFAULT 99.4,
                    speed_capture_limit_kmh INTEGER DEFAULT 60,
                    status TEXT DEFAULT 'CALIBRATED_OPTIMAL',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[ANPRCalibrationNode]:
        ANPRCalibrationRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM anpr_calibrations ORDER BY camera_id ASC")
            return [ANPRCalibrationNode(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(node: ANPRCalibrationNode) -> bool:
        ANPRCalibrationRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO anpr_calibrations (
                    id, camera_id, zone_id, shutter_speed_microseconds,
                    ir_illumination_level_pct, target_focal_length_mm,
                    ocr_accuracy_rate_pct, speed_capture_limit_kmh,
                    status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.camera_id, node.zone_id,
                node.shutter_speed_microseconds,
                node.ir_illumination_level_pct,
                node.target_focal_length_mm,
                node.ocr_accuracy_rate_pct,
                node.speed_capture_limit_kmh,
                node.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

ANPRCalibrationRepository.init_table()
