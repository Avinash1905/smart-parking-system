"""
SmartPark Ultrasonic Bird & Pigeon Harassment Deterrent Repository Layer
Protects parked vehicle automotive paint from acidic bird droppings using non-harmful acoustic distress sweeps.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BirdDeterrentNode:
    def __init__(
        self,
        id: str = "",
        node_code: str = "BIRD-GUARD-ROOF-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Open Deck",
        frequency_mode: str = "ULTRASONIC_BIO_ACOUSTIC_PULSE",
        optical_laser_strobe_active: bool = True,
        bird_nesting_incidents_30d: int = 0,
        paint_damage_claims_prevented: int = 42,
        status: str = "PERIMETER_SECURE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"brd-{uuid.uuid4().hex[:8]}"
        self.node_code = node_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.frequency_mode = frequency_mode
        self.optical_laser_strobe_active = optical_laser_strobe_active
        self.bird_nesting_incidents_30d = bird_nesting_incidents_30d
        self.paint_damage_claims_prevented = paint_damage_claims_prevented
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "node_code": self.node_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "frequency_mode": self.frequency_mode,
            "optical_laser_strobe_active": self.optical_laser_strobe_active,
            "bird_nesting_incidents_30d": self.bird_nesting_incidents_30d,
            "paint_damage_claims_prevented": self.paint_damage_claims_prevented,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BirdDeterrentRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS bird_deterrent_nodes (
                    id TEXT PRIMARY KEY,
                    node_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    frequency_mode TEXT DEFAULT 'ULTRASONIC_BIO_ACOUSTIC_PULSE',
                    optical_laser_strobe_active INTEGER DEFAULT 1,
                    bird_nesting_incidents_30d INTEGER DEFAULT 0,
                    paint_damage_claims_prevented INTEGER DEFAULT 42,
                    status TEXT DEFAULT 'PERIMETER_SECURE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> BirdDeterrentNode:
        BirdDeterrentRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM bird_deterrent_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["optical_laser_strobe_active"] = bool(d["optical_laser_strobe_active"])
                return BirdDeterrentNode(**d)
            node = BirdDeterrentNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO bird_deterrent_nodes (
                    id, node_code, zone_id, floor_level,
                    frequency_mode, optical_laser_strobe_active,
                    bird_nesting_incidents_30d,
                    paint_damage_claims_prevented, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.node_code, node.zone_id, node.floor_level,
                node.frequency_mode,
                1 if node.optical_laser_strobe_active else 0,
                node.bird_nesting_incidents_30d,
                node.paint_damage_claims_prevented,
                node.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

BirdDeterrentRepository.init_table()
