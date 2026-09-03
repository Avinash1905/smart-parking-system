"""
SmartPark Laser Wheel Rim Alignment & Curb-Rash Prevention Repository Layer
Manages overhead green laser crosshair projectors, tire sidewall clearance sensors, and curb-rash prevention guidance.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RimAlignmentNode:
    def __init__(
        self,
        id: str = "",
        laser_code: str = "LASER-GUIDE-B1-01",
        slot_code: str = "A-01",
        zone_id: str = "zone-pub-01",
        laser_crosshair_projector_active: bool = True,
        left_wheel_curb_clearance_cm: float = 14.2,
        right_wheel_curb_clearance_cm: float = 15.8,
        wheel_curb_rash_risk_tier: str = "PERFECT_CENTER_ALIGNED",
        status: str = "LASER_GUIDE_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rim-{uuid.uuid4().hex[:8]}"
        self.laser_code = laser_code
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.laser_crosshair_projector_active = laser_crosshair_projector_active
        self.left_wheel_curb_clearance_cm = left_wheel_curb_clearance_cm
        self.right_wheel_curb_clearance_cm = right_wheel_curb_clearance_cm
        self.wheel_curb_rash_risk_tier = wheel_curb_rash_risk_tier
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "laser_code": self.laser_code,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "laser_crosshair_projector_active": self.laser_crosshair_projector_active,
            "left_wheel_curb_clearance_cm": self.left_wheel_curb_clearance_cm,
            "right_wheel_curb_clearance_cm": self.right_wheel_curb_clearance_cm,
            "wheel_curb_rash_risk_tier": self.wheel_curb_rash_risk_tier,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RimAlignmentRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rim_alignment_nodes (
                    id TEXT PRIMARY KEY,
                    laser_code TEXT UNIQUE NOT NULL,
                    slot_code TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    laser_crosshair_projector_active INTEGER DEFAULT 1,
                    left_wheel_curb_clearance_cm REAL DEFAULT 14.2,
                    right_wheel_curb_clearance_cm REAL DEFAULT 15.8,
                    wheel_curb_rash_risk_tier TEXT DEFAULT 'PERFECT_CENTER_ALIGNED',
                    status TEXT DEFAULT 'LASER_GUIDE_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RimAlignmentNode:
        RimAlignmentRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM rim_alignment_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["laser_crosshair_projector_active"] = bool(d["laser_crosshair_projector_active"])
                return RimAlignmentNode(**d)
            node = RimAlignmentNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO rim_alignment_nodes (
                    id, laser_code, slot_code, zone_id,
                    laser_crosshair_projector_active,
                    left_wheel_curb_clearance_cm,
                    right_wheel_curb_clearance_cm,
                    wheel_curb_rash_risk_tier, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.laser_code, node.slot_code, node.zone_id,
                1 if node.laser_crosshair_projector_active else 0,
                node.left_wheel_curb_clearance_cm,
                node.right_wheel_curb_clearance_cm,
                node.wheel_curb_rash_risk_tier, node.status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

RimAlignmentRepository.init_table()
