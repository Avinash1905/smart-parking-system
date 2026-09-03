"""
SmartPark Ramp Blind Corner Doppler Radar & Convex Warning Beacon Repository Layer
Manages microwave doppler radar vehicle approach detectors, flashing optical strobe mirrors, and head-on collision avoidance on tight ramps.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BlindCornerBeaconNode:
    def __init__(
        self,
        id: str = "",
        beacon_code: str = "BEACON-CORNER-B1-01",
        zone_id: str = "zone-pub-01",
        location_label: str = "Floor B1-to-B2 Helical Turn",
        approaching_vehicle_detected: bool = False,
        measured_approach_speed_kmh: float = 12.4,
        amber_strobe_flashing: bool = False,
        anti_collision_status: str = "CORNER_CLEAR_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"bcn-{uuid.uuid4().hex[:8]}"
        self.beacon_code = beacon_code
        self.zone_id = zone_id
        self.location_label = location_label
        self.approaching_vehicle_detected = approaching_vehicle_detected
        self.measured_approach_speed_kmh = measured_approach_speed_kmh
        self.amber_strobe_flashing = amber_strobe_flashing
        self.anti_collision_status = anti_collision_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "beacon_code": self.beacon_code,
            "zone_id": self.zone_id,
            "location_label": self.location_label,
            "approaching_vehicle_detected": self.approaching_vehicle_detected,
            "measured_approach_speed_kmh": self.measured_approach_speed_kmh,
            "amber_strobe_flashing": self.amber_strobe_flashing,
            "anti_collision_status": self.anti_collision_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BlindCornerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS blind_corner_beacon_nodes (
                    id TEXT PRIMARY KEY,
                    beacon_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    location_label TEXT NOT NULL,
                    approaching_vehicle_detected INTEGER DEFAULT 0,
                    measured_approach_speed_kmh REAL DEFAULT 12.4,
                    amber_strobe_flashing INTEGER DEFAULT 0,
                    anti_collision_status TEXT DEFAULT 'CORNER_CLEAR_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> BlindCornerBeaconNode:
        BlindCornerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM blind_corner_beacon_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["approaching_vehicle_detected"] = bool(d["approaching_vehicle_detected"])
                d["amber_strobe_flashing"] = bool(d["amber_strobe_flashing"])
                return BlindCornerBeaconNode(**d)
            node = BlindCornerBeaconNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO blind_corner_beacon_nodes (
                    id, beacon_code, zone_id, location_label,
                    approaching_vehicle_detected, measured_approach_speed_kmh,
                    amber_strobe_flashing, anti_collision_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.beacon_code, node.zone_id, node.location_label,
                1 if node.approaching_vehicle_detected else 0,
                node.measured_approach_speed_kmh,
                1 if node.amber_strobe_flashing else 0,
                node.anti_collision_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

BlindCornerRepository.init_table()
