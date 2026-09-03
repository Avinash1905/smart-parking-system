"""
SmartPark Ultrasonic Rodent & Pest Deterrent Transducer Matrix Repository Layer
Protects parked vehicle wiring harnesses from rodent chewing using swept high-frequency ultrasound (22-65 kHz).
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PestDeterrentTransducer:
    def __init__(
        self,
        id: str = "",
        transducer_code: str = "PEST-US-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1",
        frequency_sweep_khz: str = "22 - 65 kHz Swept",
        acoustic_pressure_db: float = 110.0,
        wiring_damage_incidents_30d: int = 0,
        status: str = "ACTIVE_PULSING",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"pst-{uuid.uuid4().hex[:8]}"
        self.transducer_code = transducer_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.frequency_sweep_khz = frequency_sweep_khz
        self.acoustic_pressure_db = acoustic_pressure_db
        self.wiring_damage_incidents_30d = wiring_damage_incidents_30d
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "transducer_code": self.transducer_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "frequency_sweep_khz": self.frequency_sweep_khz,
            "acoustic_pressure_db": self.acoustic_pressure_db,
            "wiring_damage_incidents_30d": self.wiring_damage_incidents_30d,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PestDeterrentRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS pest_deterrent_transducers (
                    id TEXT PRIMARY KEY,
                    transducer_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    frequency_sweep_khz TEXT DEFAULT '22 - 65 kHz Swept',
                    acoustic_pressure_db REAL DEFAULT 110.0,
                    wiring_damage_incidents_30d INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'ACTIVE_PULSING',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[PestDeterrentTransducer]:
        PestDeterrentRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM pest_deterrent_transducers ORDER BY transducer_code ASC")
            return [PestDeterrentTransducer(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: PestDeterrentTransducer) -> bool:
        PestDeterrentRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO pest_deterrent_transducers (
                    id, transducer_code, zone_id, floor_level,
                    frequency_sweep_khz, acoustic_pressure_db,
                    wiring_damage_incidents_30d, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.transducer_code, item.zone_id,
                item.floor_level, item.frequency_sweep_khz,
                item.acoustic_pressure_db,
                item.wiring_damage_incidents_30d, item.status,
                now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

PestDeterrentRepository.init_table()
