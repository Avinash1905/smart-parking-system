"""
SmartPark Structural Column Dual-Axis Tilt Inclinometer Repository Layer
Manages high-precision dual-axis MEMS inclinometers measuring structural tilt angles (arcseconds / milliradians) and foundation differential settlement.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ColumnTiltNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "TILT-INCLINO-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Primary Column 08",
        tilt_x_axis_arcsec: float = 14.2,  # Allowable limit < 60.0 arcsec (0.29 mrad)
        tilt_y_axis_arcsec: float = -8.5,
        total_resultant_tilt_mrad: float = 0.08,
        allowable_tilt_limit_mrad: float = 0.29,
        plumb_alignment_status: str = "STRUCTURAL_PLUMB_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"cti-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.tilt_x_axis_arcsec = tilt_x_axis_arcsec
        self.tilt_y_axis_arcsec = tilt_y_axis_arcsec
        self.total_resultant_tilt_mrad = total_resultant_tilt_mrad
        self.allowable_tilt_limit_mrad = allowable_tilt_limit_mrad
        self.plumb_alignment_status = plumb_alignment_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "tilt_x_axis_arcsec": self.tilt_x_axis_arcsec,
            "tilt_y_axis_arcsec": self.tilt_y_axis_arcsec,
            "total_resultant_tilt_mrad": self.total_resultant_tilt_mrad,
            "allowable_tilt_limit_mrad": self.allowable_tilt_limit_mrad,
            "plumb_alignment_status": self.plumb_alignment_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ColumnTiltRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS column_tilt_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    tilt_x_axis_arcsec REAL DEFAULT 14.2,
                    tilt_y_axis_arcsec REAL DEFAULT -8.5,
                    total_resultant_tilt_mrad REAL DEFAULT 0.08,
                    allowable_tilt_limit_mrad REAL DEFAULT 0.29,
                    plumb_alignment_status TEXT DEFAULT 'STRUCTURAL_PLUMB_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ColumnTiltNode:
        ColumnTiltRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM column_tilt_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return ColumnTiltNode(**dict(row))
            node = ColumnTiltNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO column_tilt_nodes (
                    id, sensor_code, zone_id, floor_level,
                    tilt_x_axis_arcsec, tilt_y_axis_arcsec,
                    total_resultant_tilt_mrad,
                    allowable_tilt_limit_mrad,
                    plumb_alignment_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.tilt_x_axis_arcsec, node.tilt_y_axis_arcsec,
                node.total_resultant_tilt_mrad,
                node.allowable_tilt_limit_mrad,
                node.plumb_alignment_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ColumnTiltRepository.init_table()
