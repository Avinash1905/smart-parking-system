"""
SmartPark Substation SF6 Decomposition Byproduct Photoacoustic Spectrometer Repository Layer
Manages infrared photoacoustic spectroscopy gas chambers, SO2/HF decomposition byproduct ppm monitoring, and electrical arc fault diagnostics.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SF6DecompositionNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "SF6-PAS-SPECTROMETER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation 11kV GIS Switchgear Bay",
        measured_so2_ppm: float = 0.45,       # Allowable SO2 < 5.0 ppm
        measured_hf_ppm: float = 0.12,        # Allowable HF < 2.0 ppm
        moisture_dewpoint_celsius: float = -42.5,  # Allowable dewpoint < -36°C
        spectrometer_status: str = "SF6_DECOMPOSITION_NOMINAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"sds-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_so2_ppm = measured_so2_ppm
        self.measured_hf_ppm = measured_hf_ppm
        self.moisture_dewpoint_celsius = moisture_dewpoint_celsius
        self.spectrometer_status = spectrometer_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_so2_ppm": self.measured_so2_ppm,
            "measured_hf_ppm": self.measured_hf_ppm,
            "moisture_dewpoint_celsius": self.moisture_dewpoint_celsius,
            "spectrometer_status": self.spectrometer_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SF6DecompositionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sf6_decomposition_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_so2_ppm REAL DEFAULT 0.45,
                    measured_hf_ppm REAL DEFAULT 0.12,
                    moisture_dewpoint_celsius REAL DEFAULT -42.5,
                    spectrometer_status TEXT DEFAULT 'SF6_DECOMPOSITION_NOMINAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SF6DecompositionNode:
        SF6DecompositionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sf6_decomposition_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SF6DecompositionNode(**dict(row))
            node = SF6DecompositionNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO sf6_decomposition_nodes (
                    id, sensor_code, zone_id, floor_level,
                    measured_so2_ppm, measured_hf_ppm,
                    moisture_dewpoint_celsius, spectrometer_status,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.measured_so2_ppm, node.measured_hf_ppm,
                node.moisture_dewpoint_celsius, node.spectrometer_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SF6DecompositionRepository.init_table()
