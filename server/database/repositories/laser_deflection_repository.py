"""
SmartPark Laser Optical Span Deflection Benchmark Target Array Repository Layer
Manages sub-millimeter phase-shift laser distance meters tracking live load vertical deflection (mm) at slab center mid-spans.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class LaserDeflectionNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "LASER-DEFLECT-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Center Span Midpoint",
        measured_live_deflection_mm: float = 3.4,  # Allowable L/360 limit < 12.5 mm
        allowable_deflection_limit_mm: float = 12.5,
        laser_distance_to_target_meters: float = 4.250,
        optical_target_reflectivity_pct: float = 98.5,
        span_deflection_status: str = "LIVE_LOAD_ELASTIC_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ldn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_live_deflection_mm = measured_live_deflection_mm
        self.allowable_deflection_limit_mm = allowable_deflection_limit_mm
        self.laser_distance_to_target_meters = laser_distance_to_target_meters
        self.optical_target_reflectivity_pct = optical_target_reflectivity_pct
        self.span_deflection_status = span_deflection_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_live_deflection_mm": self.measured_live_deflection_mm,
            "allowable_deflection_limit_mm": self.allowable_deflection_limit_mm,
            "laser_distance_to_target_meters": self.laser_distance_to_target_meters,
            "optical_target_reflectivity_pct": self.optical_target_reflectivity_pct,
            "span_deflection_status": self.span_deflection_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class LaserDeflectionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS laser_deflection_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_live_deflection_mm REAL DEFAULT 3.4,
                    allowable_deflection_limit_mm REAL DEFAULT 12.5,
                    laser_distance_to_target_meters REAL DEFAULT 4.250,
                    optical_target_reflectivity_pct REAL DEFAULT 98.5,
                    span_deflection_status TEXT DEFAULT 'LIVE_LOAD_ELASTIC_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> LaserDeflectionNode:
        LaserDeflectionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM laser_deflection_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return LaserDeflectionNode(**dict(row))
            node = LaserDeflectionNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO laser_deflection_nodes (
                    id, sensor_code, zone_id, floor_level,
                    measured_live_deflection_mm,
                    allowable_deflection_limit_mm,
                    laser_distance_to_target_meters,
                    optical_target_reflectivity_pct,
                    span_deflection_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.measured_live_deflection_mm,
                node.allowable_deflection_limit_mm,
                node.laser_distance_to_target_meters,
                node.optical_target_reflectivity_pct,
                node.span_deflection_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

LaserDeflectionRepository.init_table()
