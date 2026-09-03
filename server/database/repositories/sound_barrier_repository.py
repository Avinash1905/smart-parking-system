"""
SmartPark Sound Transmission Class (STC) Acoustic Perimeter Barrier Repository Layer
Manages perimeter noise barrier curtains, external property boundary decibel (dBA) attenuation, and municipal quiet-zone standards.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SoundBarrierNode:
    def __init__(
        self,
        id: str = "",
        barrier_code: str = "ACOUSTIC-WALL-PERIM-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Deck Edge Boundary",
        inside_noise_level_dba: float = 78.4,
        outside_boundary_noise_dba: float = 46.2,
        acoustic_attenuation_reduction_dba: float = 32.2,
        stc_rating: int = 45,
        compliance_status: str = "MUNICIPAL_RESIDENTIAL_COMPLIANT",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"acb-{uuid.uuid4().hex[:8]}"
        self.barrier_code = barrier_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.inside_noise_level_dba = inside_noise_level_dba
        self.outside_boundary_noise_dba = outside_boundary_noise_dba
        self.acoustic_attenuation_reduction_dba = acoustic_attenuation_reduction_dba
        self.stc_rating = stc_rating
        self.compliance_status = compliance_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "barrier_code": self.barrier_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "inside_noise_level_dba": self.inside_noise_level_dba,
            "outside_boundary_noise_dba": self.outside_boundary_noise_dba,
            "acoustic_attenuation_reduction_dba": self.acoustic_attenuation_reduction_dba,
            "stc_rating": self.stc_rating,
            "compliance_status": self.compliance_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SoundBarrierRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sound_barrier_nodes (
                    id TEXT PRIMARY KEY,
                    barrier_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    inside_noise_level_dba REAL DEFAULT 78.4,
                    outside_boundary_noise_dba REAL DEFAULT 46.2,
                    acoustic_attenuation_reduction_dba REAL DEFAULT 32.2,
                    stc_rating INTEGER DEFAULT 45,
                    compliance_status TEXT DEFAULT 'MUNICIPAL_RESIDENTIAL_COMPLIANT',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SoundBarrierNode:
        SoundBarrierRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sound_barrier_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SoundBarrierNode(**dict(row))
            node = SoundBarrierNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO sound_barrier_nodes (
                    id, barrier_code, zone_id, floor_level,
                    inside_noise_level_dba, outside_boundary_noise_dba,
                    acoustic_attenuation_reduction_dba, stc_rating,
                    compliance_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.barrier_code, node.zone_id, node.floor_level,
                node.inside_noise_level_dba,
                node.outside_boundary_noise_dba,
                node.acoustic_attenuation_reduction_dba,
                node.stc_rating, node.compliance_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SoundBarrierRepository.init_table()
