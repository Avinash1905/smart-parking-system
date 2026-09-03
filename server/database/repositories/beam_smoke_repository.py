"""
SmartPark Optical Projected Beam Smoke Detector (NFPA 72) Repository Layer
Manages infrared transmitter-receiver beam smoke detectors measuring linear optical obscuration (%/m) across 100-meter open drive aisle spans.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BeamSmokeDetectorNode:
    def __init__(
        self,
        id: str = "",
        detector_code: str = "BEAM-SMOKE-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Main Optical Span",
        beam_path_length_meters: float = 100.0,
        optical_obscuration_pct_per_m: float = 0.28,  # Alarm Threshold > 2.50 %/m
        signal_attenuation_status: str = "OPTICAL_BEAM_PRISTINE",
        nfpa_72_compliance: str = "NFPA_72_CERTIFIED_NORMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"bsd-{uuid.uuid4().hex[:8]}"
        self.detector_code = detector_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.beam_path_length_meters = beam_path_length_meters
        self.optical_obscuration_pct_per_m = optical_obscuration_pct_per_m
        self.signal_attenuation_status = signal_attenuation_status
        self.nfpa_72_compliance = nfpa_72_compliance
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "detector_code": self.detector_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "beam_path_length_meters": self.beam_path_length_meters,
            "optical_obscuration_pct_per_m": self.optical_obscuration_pct_per_m,
            "signal_attenuation_status": self.signal_attenuation_status,
            "nfpa_72_compliance": self.nfpa_72_compliance,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BeamSmokeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS beam_smoke_detector_nodes (
                    id TEXT PRIMARY KEY,
                    detector_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    beam_path_length_meters REAL DEFAULT 100.0,
                    optical_obscuration_pct_per_m REAL DEFAULT 0.28,
                    signal_attenuation_status TEXT DEFAULT 'OPTICAL_BEAM_PRISTINE',
                    nfpa_72_compliance TEXT DEFAULT 'NFPA_72_CERTIFIED_NORMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> BeamSmokeDetectorNode:
        BeamSmokeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM beam_smoke_detector_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return BeamSmokeDetectorNode(**dict(row))
            node = BeamSmokeDetectorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO beam_smoke_detector_nodes (
                    id, detector_code, zone_id, floor_level,
                    beam_path_length_meters, optical_obscuration_pct_per_m,
                    signal_attenuation_status, nfpa_72_compliance,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.detector_code, node.zone_id, node.floor_level,
                node.beam_path_length_meters,
                node.optical_obscuration_pct_per_m,
                node.signal_attenuation_status,
                node.nfpa_72_compliance, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

BeamSmokeRepository.init_table()
