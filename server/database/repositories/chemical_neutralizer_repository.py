"""
SmartPark Chemical Spill Neutralizer & Bio-Enzyme Foam Sprayer Repository Layer
Manages automated overhead foam sprayers dispensing hydrocarbon-eating enzymes to instantly neutralize motor oil spills.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ChemicalNeutralizerNode:
    def __init__(
        self,
        id: str = "",
        sprayer_code: str = "NEUTRALIZER-SPRAY-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Bay 4",
        oil_slick_detected: bool = False,
        bio_enzyme_tank_level_pct: float = 92.5,
        hydrocarbon_digestion_rate_mins: int = 15,
        neutralizer_readiness: str = "SPILL_RESPONSE_ARMED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"cnz-{uuid.uuid4().hex[:8]}"
        self.sprayer_code = sprayer_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.oil_slick_detected = oil_slick_detected
        self.bio_enzyme_tank_level_pct = bio_enzyme_tank_level_pct
        self.hydrocarbon_digestion_rate_mins = hydrocarbon_digestion_rate_mins
        self.neutralizer_readiness = neutralizer_readiness
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sprayer_code": self.sprayer_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "oil_slick_detected": self.oil_slick_detected,
            "bio_enzyme_tank_level_pct": self.bio_enzyme_tank_level_pct,
            "hydrocarbon_digestion_rate_mins": self.hydrocarbon_digestion_rate_mins,
            "neutralizer_readiness": self.neutralizer_readiness,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ChemicalNeutralizerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chemical_neutralizer_nodes (
                    id TEXT PRIMARY KEY,
                    sprayer_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    oil_slick_detected INTEGER DEFAULT 0,
                    bio_enzyme_tank_level_pct REAL DEFAULT 92.5,
                    hydrocarbon_digestion_rate_mins INTEGER DEFAULT 15,
                    neutralizer_readiness TEXT DEFAULT 'SPILL_RESPONSE_ARMED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ChemicalNeutralizerNode:
        ChemicalNeutralizerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM chemical_neutralizer_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["oil_slick_detected"] = bool(d["oil_slick_detected"])
                return ChemicalNeutralizerNode(**d)
            node = ChemicalNeutralizerNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO chemical_neutralizer_nodes (
                    id, sprayer_code, zone_id, floor_level,
                    oil_slick_detected, bio_enzyme_tank_level_pct,
                    hydrocarbon_digestion_rate_mins,
                    neutralizer_readiness, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sprayer_code, node.zone_id, node.floor_level,
                1 if node.oil_slick_detected else 0,
                node.bio_enzyme_tank_level_pct,
                node.hydrocarbon_digestion_rate_mins,
                node.neutralizer_readiness, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ChemicalNeutralizerRepository.init_table()
