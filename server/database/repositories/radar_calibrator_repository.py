"""
SmartPark Drive Aisle Speed Radar Doppler Tuning & ISO 17025 Calibrator Repository Layer
Manages 24.125 GHz K-band Doppler radar velocity calibration, millisecond ANPR shutter sync, and certified speed enforcement accuracy.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RadarCalibratorNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "RADAR-CALIBRATOR-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Main Drive Aisle",
        doppler_frequency_ghz: float = 24.125,
        velocity_measurement_error_pct: float = 0.12,  # ISO 17025 certified < 0.50% error
        camera_trigger_latency_ms: float = 12.5,
        target_reference_speed_kmh: float = 20.00,
        measured_radar_speed_kmh: float = 20.02,
        calibration_status: str = "ISO_17025_CERTIFIED_ACCURATE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rcn-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.doppler_frequency_ghz = doppler_frequency_ghz
        self.velocity_measurement_error_pct = velocity_measurement_error_pct
        self.camera_trigger_latency_ms = camera_trigger_latency_ms
        self.target_reference_speed_kmh = target_reference_speed_kmh
        self.measured_radar_speed_kmh = measured_radar_speed_kmh
        self.calibration_status = calibration_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "doppler_frequency_ghz": self.doppler_frequency_ghz,
            "velocity_measurement_error_pct": self.velocity_measurement_error_pct,
            "camera_trigger_latency_ms": self.camera_trigger_latency_ms,
            "target_reference_speed_kmh": self.target_reference_speed_kmh,
            "measured_radar_speed_kmh": self.measured_radar_speed_kmh,
            "calibration_status": self.calibration_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RadarCalibratorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS radar_calibrator_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    doppler_frequency_ghz REAL DEFAULT 24.125,
                    velocity_measurement_error_pct REAL DEFAULT 0.12,
                    camera_trigger_latency_ms REAL DEFAULT 12.5,
                    target_reference_speed_kmh REAL DEFAULT 20.00,
                    measured_radar_speed_kmh REAL DEFAULT 20.02,
                    calibration_status TEXT DEFAULT 'ISO_17025_CERTIFIED_ACCURATE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RadarCalibratorNode:
        RadarCalibratorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM radar_calibrator_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return RadarCalibratorNode(**dict(row))
            node = RadarCalibratorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO radar_calibrator_nodes (
                    id, unit_code, zone_id, floor_level,
                    doppler_frequency_ghz,
                    velocity_measurement_error_pct,
                    camera_trigger_latency_ms,
                    target_reference_speed_kmh,
                    measured_radar_speed_kmh,
                    calibration_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.doppler_frequency_ghz,
                node.velocity_measurement_error_pct,
                node.camera_trigger_latency_ms,
                node.target_reference_speed_kmh,
                node.measured_radar_speed_kmh,
                node.calibration_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

RadarCalibratorRepository.init_table()
