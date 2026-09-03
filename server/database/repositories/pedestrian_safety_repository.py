"""
SmartPark Pedestrian Safety & Blind-Spot Radar Repository Layer
Manages crosswalk motion radars, blind-corner smart mirrors, and driver audio-visual pedestrian warnings.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PedestrianRadarNode:
    def __init__(
        self,
        id: str = "",
        crosswalk_code: str = "CW-ELEV-LOBBY-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor G",
        motion_radar_active: bool = True,
        pedestrian_in_crosswalk: bool = False,
        warning_flasher_status: str = "STANDBY",  # STANDBY | FLASHING_ACTIVE
        audible_chime_enabled: bool = True,
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rad-{uuid.uuid4().hex[:8]}"
        self.crosswalk_code = crosswalk_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.motion_radar_active = motion_radar_active
        self.pedestrian_in_crosswalk = pedestrian_in_crosswalk
        self.warning_flasher_status = warning_flasher_status
        self.audible_chime_enabled = audible_chime_enabled
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "crosswalk_code": self.crosswalk_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "motion_radar_active": self.motion_radar_active,
            "pedestrian_in_crosswalk": self.pedestrian_in_crosswalk,
            "warning_flasher_status": self.warning_flasher_status,
            "audible_chime_enabled": self.audible_chime_enabled,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PedestrianRadarRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS pedestrian_radar_nodes (
                    id TEXT PRIMARY KEY,
                    crosswalk_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    motion_radar_active INTEGER DEFAULT 1,
                    pedestrian_in_crosswalk INTEGER DEFAULT 0,
                    warning_flasher_status TEXT DEFAULT 'STANDBY',
                    audible_chime_enabled INTEGER DEFAULT 1,
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[PedestrianRadarNode]:
        PedestrianRadarRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM pedestrian_radar_nodes ORDER BY crosswalk_code ASC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["motion_radar_active"] = bool(d["motion_radar_active"])
                d["pedestrian_in_crosswalk"] = bool(d["pedestrian_in_crosswalk"])
                d["audible_chime_enabled"] = bool(d["audible_chime_enabled"])
                res.append(PedestrianRadarNode(**d))
            return res

    @staticmethod
    def create(item: PedestrianRadarNode) -> bool:
        PedestrianRadarRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO pedestrian_radar_nodes (
                    id, crosswalk_code, zone_id, floor_level,
                    motion_radar_active, pedestrian_in_crosswalk,
                    warning_flasher_status, audible_chime_enabled,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.crosswalk_code, item.zone_id, item.floor_level,
                1 if item.motion_radar_active else 0,
                1 if item.pedestrian_in_crosswalk else 0,
                item.warning_flasher_status,
                1 if item.audible_chime_enabled else 0, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

PedestrianRadarRepository.init_table()
