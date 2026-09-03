"""
SmartPark Overhead Vehicle Clearance Laser Profilometer Repository Layer
Manages dual 905nm LiDAR curtain profilers, real-time vehicle height scanning (2.15m), low-clearance obstacle collision prevention, and roof rack warnings.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class VehicleHeightLaserNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "LIDAR-CLEARANCE-PROFILER-01",
        zone_id: str = "zone-pub-01",
        ingress_portal: str = "Main Ingress Portal Archway",
        measured_vehicle_height_meters: float = 1.78,  # Measured profile
        deck_clearance_limit_meters: float = 2.40,     # Max allowable facility height
        roof_rack_detected: bool = False,
        overheight_alarm_triggered: bool = False,
        profiler_status: str = "CLEARANCE_PROFILE_PASS",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"vhl-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.ingress_portal = ingress_portal
        self.measured_vehicle_height_meters = measured_vehicle_height_meters
        self.deck_clearance_limit_meters = deck_clearance_limit_meters
        self.roof_rack_detected = roof_rack_detected
        self.overheight_alarm_triggered = overheight_alarm_triggered
        self.profiler_status = profiler_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "ingress_portal": self.ingress_portal,
            "measured_vehicle_height_meters": self.measured_vehicle_height_meters,
            "deck_clearance_limit_meters": self.deck_clearance_limit_meters,
            "roof_rack_detected": self.roof_rack_detected,
            "overheight_alarm_triggered": self.overheight_alarm_triggered,
            "profiler_status": self.profiler_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class VehicleHeightLaserRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vehicle_height_laser_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    ingress_portal TEXT NOT NULL,
                    measured_vehicle_height_meters REAL DEFAULT 1.78,
                    deck_clearance_limit_meters REAL DEFAULT 2.40,
                    roof_rack_detected INTEGER DEFAULT 0,
                    overheight_alarm_triggered INTEGER DEFAULT 0,
                    profiler_status TEXT DEFAULT 'CLEARANCE_PROFILE_PASS',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> VehicleHeightLaserNode:
        VehicleHeightLaserRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM vehicle_height_laser_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["roof_rack_detected"] = bool(d["roof_rack_detected"])
                d["overheight_alarm_triggered"] = bool(d["overheight_alarm_triggered"])
                return VehicleHeightLaserNode(**d)
            node = VehicleHeightLaserNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO vehicle_height_laser_nodes (
                    id, sensor_code, zone_id, ingress_portal,
                    measured_vehicle_height_meters,
                    deck_clearance_limit_meters,
                    roof_rack_detected, overheight_alarm_triggered,
                    profiler_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.ingress_portal,
                node.measured_vehicle_height_meters,
                node.deck_clearance_limit_meters,
                1 if node.roof_rack_detected else 0,
                1 if node.overheight_alarm_triggered else 0,
                node.profiler_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

VehicleHeightLaserRepository.init_table()
