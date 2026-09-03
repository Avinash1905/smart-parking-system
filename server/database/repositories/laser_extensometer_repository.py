"""
SmartPark Structural Thermal Expansion Joint Laser Extensometer Repository Layer
Manages high-precision 650nm semiconductor laser distance meters, continuous expansion joint gap width (mm) monitoring, and shear displacement warnings.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class LaserExtensometerNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "LASER-EXTENSOMETER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Level 2-3 Main Structural Expansion Joint",
        measured_gap_width_mm: float = 38.4,    # Design nominal 40.0 mm (+/- 15 mm)
        ambient_temperature_celsius: float = 29.8,
        thermal_expansion_coefficient: float = 1.2e-5,
        shear_misalignment_mm: float = 0.8,
        extensometer_status: str = "JOINT_EXPANSION_NOMINAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"len-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_gap_width_mm = measured_gap_width_mm
        self.ambient_temperature_celsius = ambient_temperature_celsius
        self.thermal_expansion_coefficient = thermal_expansion_coefficient
        self.shear_misalignment_mm = shear_misalignment_mm
        self.extensometer_status = extensometer_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_gap_width_mm": self.measured_gap_width_mm,
            "ambient_temperature_celsius": self.ambient_temperature_celsius,
            "thermal_expansion_coefficient": self.thermal_expansion_coefficient,
            "shear_misalignment_mm": self.shear_misalignment_mm,
            "extensometer_status": self.extensometer_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class LaserExtensometerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS laser_extensometer_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_gap_width_mm REAL DEFAULT 38.4,
                    ambient_temperature_celsius REAL DEFAULT 29.8,
                    thermal_expansion_coefficient REAL DEFAULT 1.2e-5,
                    shear_misalignment_mm REAL DEFAULT 0.8,
                    extensometer_status TEXT DEFAULT 'JOINT_EXPANSION_NOMINAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> LaserExtensometerNode:
        LaserExtensometerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM laser_extensometer_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return LaserExtensometerNode(**dict(row))
            node = LaserExtensometerNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO laser_extensometer_nodes (
                    id, sensor_code, zone_id, floor_level,
                    measured_gap_width_mm,
                    ambient_temperature_celsius,
                    thermal_expansion_coefficient,
                    shear_misalignment_mm,
                    extensometer_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.measured_gap_width_mm,
                node.ambient_temperature_celsius,
                node.thermal_expansion_coefficient,
                node.shear_misalignment_mm,
                node.extensometer_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

LaserExtensometerRepository.init_table()
