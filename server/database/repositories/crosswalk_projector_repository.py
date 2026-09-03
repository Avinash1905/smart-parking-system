"""
SmartPark Overhead Optical Crosswalk Gobo Projector Repository Layer
Manages high-intensity LED gobo projectors casting glowing illuminated pedestrian crosswalks on garage aisle floors when pedestrians approach.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CrosswalkProjectorNode:
    def __init__(
        self,
        id: str = "",
        projector_code: str = "CROSSWALK-GOBO-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Drive Aisle",
        lumens_output: int = 15000,
        pedestrian_presence_detected: bool = True,
        projection_pattern: str = "HIGH_CONTRAST_ZEBRA_FLASHING",
        duty_cycle_state: str = "ACTIVE_PROJECTION_ENGAGED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"cwp-{uuid.uuid4().hex[:8]}"
        self.projector_code = projector_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.lumens_output = lumens_output
        self.pedestrian_presence_detected = pedestrian_presence_detected
        self.projection_pattern = projection_pattern
        self.duty_cycle_state = duty_cycle_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "projector_code": self.projector_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "lumens_output": self.lumens_output,
            "pedestrian_presence_detected": self.pedestrian_presence_detected,
            "projection_pattern": self.projection_pattern,
            "duty_cycle_state": self.duty_cycle_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CrosswalkProjectorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS crosswalk_projector_nodes (
                    id TEXT PRIMARY KEY,
                    projector_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    lumens_output INTEGER DEFAULT 15000,
                    pedestrian_presence_detected INTEGER DEFAULT 1,
                    projection_pattern TEXT DEFAULT 'HIGH_CONTRAST_ZEBRA_FLASHING',
                    duty_cycle_state TEXT DEFAULT 'ACTIVE_PROJECTION_ENGAGED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> CrosswalkProjectorNode:
        CrosswalkProjectorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM crosswalk_projector_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["pedestrian_presence_detected"] = bool(d["pedestrian_presence_detected"])
                return CrosswalkProjectorNode(**d)
            node = CrosswalkProjectorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO crosswalk_projector_nodes (
                    id, projector_code, zone_id, floor_level,
                    lumens_output, pedestrian_presence_detected,
                    projection_pattern, duty_cycle_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.projector_code, node.zone_id, node.floor_level,
                node.lumens_output,
                1 if node.pedestrian_presence_detected else 0,
                node.projection_pattern, node.duty_cycle_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

CrosswalkProjectorRepository.init_table()
