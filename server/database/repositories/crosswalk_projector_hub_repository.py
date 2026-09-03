"""
SmartPark Smart Pedestrian Crosswalk High-Lumen Laser Projection Repository Layer
Manages 15,000-lumen overhead high-contrast optical laser projectors, dynamic zebra stripe floor illumination, blind corner pedestrian radar alerts, and vehicle speed throttling.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CrosswalkProjectorHubNode:
    def __init__(
        self,
        id: str = "",
        projector_code: str = "CROSSWALK-LASER-HUB-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor 1 Main Blind Corner Intersection",
        projector_lumen_output: float = 15000.0,
        pedestrian_detected_in_zone: bool = True,
        illuminated_stripe_state: str = "HIGH_CONTRAST_PULSING_AMBER",
        speed_calming_radar_kmh: float = 12.5,   # Vehicle speed calming target < 15 km/h
        projector_operational_status: str = "ACTIVE_PEDESTRIAN_PROTECTION",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"cph-{uuid.uuid4().hex[:8]}"
        self.projector_code = projector_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.projector_lumen_output = projector_lumen_output
        self.pedestrian_detected_in_zone = pedestrian_detected_in_zone
        self.illuminated_stripe_state = illuminated_stripe_state
        self.speed_calming_radar_kmh = speed_calming_radar_kmh
        self.projector_operational_status = projector_operational_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "projector_code": self.projector_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "projector_lumen_output": self.projector_lumen_output,
            "pedestrian_detected_in_zone": self.pedestrian_detected_in_zone,
            "illuminated_stripe_state": self.illuminated_stripe_state,
            "speed_calming_radar_kmh": self.speed_calming_radar_kmh,
            "projector_operational_status": self.projector_operational_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CrosswalkProjectorHubRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS crosswalk_projector_hub_nodes (
                    id TEXT PRIMARY KEY,
                    projector_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    projector_lumen_output REAL DEFAULT 15000.0,
                    pedestrian_detected_in_zone INTEGER DEFAULT 1,
                    illuminated_stripe_state TEXT DEFAULT 'HIGH_CONTRAST_PULSING_AMBER',
                    speed_calming_radar_kmh REAL DEFAULT 12.5,
                    projector_operational_status TEXT DEFAULT 'ACTIVE_PEDESTRIAN_PROTECTION',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> CrosswalkProjectorHubNode:
        CrosswalkProjectorHubRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM crosswalk_projector_hub_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["pedestrian_detected_in_zone"] = bool(d["pedestrian_detected_in_zone"])
                return CrosswalkProjectorHubNode(**d)
            node = CrosswalkProjectorHubNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO crosswalk_projector_hub_nodes (
                    id, projector_code, zone_id, floor_level,
                    projector_lumen_output,
                    pedestrian_detected_in_zone,
                    illuminated_stripe_state,
                    speed_calming_radar_kmh,
                    projector_operational_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.projector_code, node.zone_id, node.floor_level,
                node.projector_lumen_output,
                1 if node.pedestrian_detected_in_zone else 0,
                node.illuminated_stripe_state,
                node.speed_calming_radar_kmh,
                node.projector_operational_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

CrosswalkProjectorHubRepository.init_table()
