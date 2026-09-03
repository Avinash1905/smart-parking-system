"""
SmartPark Helical Ramp Dynamic Traffic Signal & Directional Sequencing Repository Layer
Manages underground ramp alternating one-way traffic light phases, induction queues, and bottleneck prevention.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RampSignalPhase:
    def __init__(
        self,
        id: str = "",
        ramp_code: str = "RAMP-G-TO-B1",
        zone_id: str = "zone-pub-01",
        current_signal_phase: str = "DOWNWARD_GREEN",  # DOWNWARD_GREEN | UPWARD_GREEN | ALL_RED_CLEARING
        queue_count_downward: int = 2,
        queue_count_upward: int = 0,
        cycle_remaining_seconds: int = 18,
        bottleneck_detected: bool = False,
        status: str = "SEQUENCING_OPTIMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rmp-{uuid.uuid4().hex[:8]}"
        self.ramp_code = ramp_code
        self.zone_id = zone_id
        self.current_signal_phase = current_signal_phase
        self.queue_count_downward = queue_count_downward
        self.queue_count_upward = queue_count_upward
        self.cycle_remaining_seconds = cycle_remaining_seconds
        self.bottleneck_detected = bottleneck_detected
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "ramp_code": self.ramp_code,
            "zone_id": self.zone_id,
            "current_signal_phase": self.current_signal_phase,
            "queue_count_downward": self.queue_count_downward,
            "queue_count_upward": self.queue_count_upward,
            "cycle_remaining_seconds": self.cycle_remaining_seconds,
            "bottleneck_detected": self.bottleneck_detected,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RampSignalRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ramp_signal_phases (
                    id TEXT PRIMARY KEY,
                    ramp_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    current_signal_phase TEXT DEFAULT 'DOWNWARD_GREEN',
                    queue_count_downward INTEGER DEFAULT 2,
                    queue_count_upward INTEGER DEFAULT 0,
                    cycle_remaining_seconds INTEGER DEFAULT 18,
                    bottleneck_detected INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'SEQUENCING_OPTIMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[RampSignalPhase]:
        RampSignalRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ramp_signal_phases ORDER BY ramp_code ASC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["bottleneck_detected"] = bool(d["bottleneck_detected"])
                res.append(RampSignalPhase(**d))
            return res

    @staticmethod
    def create(item: RampSignalPhase) -> bool:
        RampSignalRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO ramp_signal_phases (
                    id, ramp_code, zone_id, current_signal_phase,
                    queue_count_downward, queue_count_upward,
                    cycle_remaining_seconds, bottleneck_detected,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.ramp_code, item.zone_id,
                item.current_signal_phase, item.queue_count_downward,
                item.queue_count_upward, item.cycle_remaining_seconds,
                1 if item.bottleneck_detected else 0,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

RampSignalRepository.init_table()
