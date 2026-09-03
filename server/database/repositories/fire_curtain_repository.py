"""
SmartPark Motorized Fire Smoke Barrier Curtain Repository Layer
Manages automated drop-down woven fiberglass fire curtains (2-hour 1000°C fire containment rating) in basements.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FireCurtainNode:
    def __init__(
        self,
        id: str = "",
        curtain_code: str = "FC-B1-NORTH-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1",
        fire_rating_hours: int = 2,
        deployment_position_pct: int = 0,  # 0 = Stowed at ceiling, 100 = Fully deployed to floor
        motor_drive_status: str = "STOWED_ARMED",  # STOWED_ARMED | DEPLOYING | DEPLOYED_LOCKED | MANUAL_OVERRIDE
        optical_obstruction_clear: bool = True,
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"fc-{uuid.uuid4().hex[:8]}"
        self.curtain_code = curtain_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.fire_rating_hours = fire_rating_hours
        self.deployment_position_pct = deployment_position_pct
        self.motor_drive_status = motor_drive_status
        self.optical_obstruction_clear = optical_obstruction_clear
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "curtain_code": self.curtain_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "fire_rating_hours": self.fire_rating_hours,
            "deployment_position_pct": self.deployment_position_pct,
            "motor_drive_status": self.motor_drive_status,
            "optical_obstruction_clear": self.optical_obstruction_clear,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FireCurtainRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS fire_curtain_nodes (
                    id TEXT PRIMARY KEY,
                    curtain_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    fire_rating_hours INTEGER DEFAULT 2,
                    deployment_position_pct INTEGER DEFAULT 0,
                    motor_drive_status TEXT DEFAULT 'STOWED_ARMED',
                    optical_obstruction_clear INTEGER DEFAULT 1,
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[FireCurtainNode]:
        FireCurtainRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM fire_curtain_nodes ORDER BY curtain_code ASC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["optical_obstruction_clear"] = bool(d["optical_obstruction_clear"])
                res.append(FireCurtainNode(**d))
            return res

    @staticmethod
    def create(item: FireCurtainNode) -> bool:
        FireCurtainRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO fire_curtain_nodes (
                    id, curtain_code, zone_id, floor_level,
                    fire_rating_hours, deployment_position_pct,
                    motor_drive_status, optical_obstruction_clear,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.curtain_code, item.zone_id, item.floor_level,
                item.fire_rating_hours, item.deployment_position_pct,
                item.motor_drive_status, 1 if item.optical_obstruction_clear else 0,
                now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

FireCurtainRepository.init_table()
