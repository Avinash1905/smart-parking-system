"""
SmartPark Concrete Subsurface Delamination Sonic Resonance Scanner Repository Layer
Manages micro-impact sonic impulse hammer arrays, acoustic frequency response analyzers (Hz), and concrete bridge deck hollow void detection.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class DelaminationScannerNode:
    def __init__(
        self,
        id: str = "",
        scanner_code: str = "SONIC-DELAM-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Driving Ramp Surface",
        acoustic_peak_frequency_hz: float = 3850.0,  # Solid concrete > 3000 Hz, Delaminated < 1500 Hz
        subsurface_void_depth_cm: float = 0.0,
        delaminated_area_pct: float = 0.0,
        acoustic_damping_coefficient: float = 0.08,
        concrete_soundness_status: str = "SOLID_HOMOGENEOUS_CONCRETE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"dsn-{uuid.uuid4().hex[:8]}"
        self.scanner_code = scanner_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.acoustic_peak_frequency_hz = acoustic_peak_frequency_hz
        self.subsurface_void_depth_cm = subsurface_void_depth_cm
        self.delaminated_area_pct = delaminated_area_pct
        self.acoustic_damping_coefficient = acoustic_damping_coefficient
        self.concrete_soundness_status = concrete_soundness_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "scanner_code": self.scanner_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "acoustic_peak_frequency_hz": self.acoustic_peak_frequency_hz,
            "subsurface_void_depth_cm": self.subsurface_void_depth_cm,
            "delaminated_area_pct": self.delaminated_area_pct,
            "acoustic_damping_coefficient": self.acoustic_damping_coefficient,
            "concrete_soundness_status": self.concrete_soundness_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class DelaminationScannerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS delamination_scanner_nodes (
                    id TEXT PRIMARY KEY,
                    scanner_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    acoustic_peak_frequency_hz REAL DEFAULT 3850.0,
                    subsurface_void_depth_cm REAL DEFAULT 0.0,
                    delaminated_area_pct REAL DEFAULT 0.0,
                    acoustic_damping_coefficient REAL DEFAULT 0.08,
                    concrete_soundness_status TEXT DEFAULT 'SOLID_HOMOGENEOUS_CONCRETE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> DelaminationScannerNode:
        DelaminationScannerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM delamination_scanner_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return DelaminationScannerNode(**dict(row))
            node = DelaminationScannerNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO delamination_scanner_nodes (
                    id, scanner_code, zone_id, floor_level,
                    acoustic_peak_frequency_hz,
                    subsurface_void_depth_cm, delaminated_area_pct,
                    acoustic_damping_coefficient,
                    concrete_soundness_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.scanner_code, node.zone_id, node.floor_level,
                node.acoustic_peak_frequency_hz,
                node.subsurface_void_depth_cm,
                node.delaminated_area_pct,
                node.acoustic_damping_coefficient,
                node.concrete_soundness_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

DelaminationScannerRepository.init_table()
