"""
SmartPark Fiber Bragg Grating (FBG) Optical Structural Strain Repository Layer
Manages fiber optic Bragg grating sensors measuring wavelength shift (picometers pm), microstrain (µε), and concrete deflection across deck spans.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FBGStrainNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "FBG-OPTICAL-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Center Girder",
        bragg_wavelength_shift_pm: float = 12.4,
        structural_microstrain_ue: float = 10.3,
        allowable_strain_limit_ue: float = 45.0,
        laser_interrogator_channel: int = 1,
        structural_elastic_state: str = "ELASTIC_DEFLECTION_OPTIMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"fbg-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.bragg_wavelength_shift_pm = bragg_wavelength_shift_pm
        self.structural_microstrain_ue = structural_microstrain_ue
        self.allowable_strain_limit_ue = allowable_strain_limit_ue
        self.laser_interrogator_channel = laser_interrogator_channel
        self.structural_elastic_state = structural_elastic_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "bragg_wavelength_shift_pm": self.bragg_wavelength_shift_pm,
            "structural_microstrain_ue": self.structural_microstrain_ue,
            "allowable_strain_limit_ue": self.allowable_strain_limit_ue,
            "laser_interrogator_channel": self.laser_interrogator_channel,
            "structural_elastic_state": self.structural_elastic_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FBGStrainRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS fbg_strain_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    bragg_wavelength_shift_pm REAL DEFAULT 12.4,
                    structural_microstrain_ue REAL DEFAULT 10.3,
                    allowable_strain_limit_ue REAL DEFAULT 45.0,
                    laser_interrogator_channel INTEGER DEFAULT 1,
                    structural_elastic_state TEXT DEFAULT 'ELASTIC_DEFLECTION_OPTIMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> FBGStrainNode:
        FBGStrainRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM fbg_strain_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return FBGStrainNode(**dict(row))
            node = FBGStrainNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO fbg_strain_nodes (
                    id, sensor_code, zone_id, floor_level,
                    bragg_wavelength_shift_pm,
                    structural_microstrain_ue,
                    allowable_strain_limit_ue,
                    laser_interrogator_channel,
                    structural_elastic_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.bragg_wavelength_shift_pm,
                node.structural_microstrain_ue,
                node.allowable_strain_limit_ue,
                node.laser_interrogator_channel,
                node.structural_elastic_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

FBGStrainRepository.init_table()
