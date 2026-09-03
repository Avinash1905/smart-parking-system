"""
SmartPark Overhead EV Cable Retractor & Motorized Reel Repository Layer
Manages motorized overhead cable drops, spring tension monitoring, and automatic plug lowering upon EV stall entry.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CableRetractorNode:
    def __init__(
        self,
        id: str = "",
        reel_code: str = "REEL-EV-A03",
        slot_code: str = "A-03",
        zone_id: str = "zone-pub-01",
        cable_drop_length_meters: float = 2.4,
        motor_drive_state: str = "STOWED_CEILING",  # STOWED_CEILING | LOWERED_READY | PLUGGED_CHARGING | RETRACTING
        spring_tension_nm: float = 14.2,
        plug_connection_locked: bool = False,
        status: str = "ONLINE_OPERATIONAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"reel-{uuid.uuid4().hex[:8]}"
        self.reel_code = reel_code
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.cable_drop_length_meters = cable_drop_length_meters
        self.motor_drive_state = motor_drive_state
        self.spring_tension_nm = spring_tension_nm
        self.plug_connection_locked = plug_connection_locked
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "reel_code": self.reel_code,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "cable_drop_length_meters": self.cable_drop_length_meters,
            "motor_drive_state": self.motor_drive_state,
            "spring_tension_nm": self.spring_tension_nm,
            "plug_connection_locked": self.plug_connection_locked,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CableRetractorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cable_retractor_nodes (
                    id TEXT PRIMARY KEY,
                    reel_code TEXT UNIQUE NOT NULL,
                    slot_code TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    cable_drop_length_meters REAL DEFAULT 2.4,
                    motor_drive_state TEXT DEFAULT 'STOWED_CEILING',
                    spring_tension_nm REAL DEFAULT 14.2,
                    plug_connection_locked INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'ONLINE_OPERATIONAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[CableRetractorNode]:
        CableRetractorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cable_retractor_nodes ORDER BY reel_code ASC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["plug_connection_locked"] = bool(d["plug_connection_locked"])
                res.append(CableRetractorNode(**d))
            return res

    @staticmethod
    def create(item: CableRetractorNode) -> bool:
        CableRetractorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO cable_retractor_nodes (
                    id, reel_code, slot_code, zone_id,
                    cable_drop_length_meters, motor_drive_state,
                    spring_tension_nm, plug_connection_locked,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.reel_code, item.slot_code, item.zone_id,
                item.cable_drop_length_meters, item.motor_drive_state,
                item.spring_tension_nm, 1 if item.plug_connection_locked else 0,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

CableRetractorRepository.init_table()
