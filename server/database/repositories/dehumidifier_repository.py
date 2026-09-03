"""
SmartPark Underground Dehumidification & Condensation Control Repository Layer
Manages desiccant wheel extractors, relative humidity RH% sensors, and moisture condensation prevention on concrete decks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class DehumidifierUnit:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "DHUM-B2-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B2 (Deep Basement)",
        relative_humidity_pct: float = 52.4,
        target_rh_threshold_pct: float = 55.0,
        water_condensed_liters_today: float = 48.5,
        compressor_duty_cycle_pct: int = 40,
        status: str = "HUMIDITY_OPTIMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"dhm-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.relative_humidity_pct = relative_humidity_pct
        self.target_rh_threshold_pct = target_rh_threshold_pct
        self.water_condensed_liters_today = water_condensed_liters_today
        self.compressor_duty_cycle_pct = compressor_duty_cycle_pct
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "relative_humidity_pct": self.relative_humidity_pct,
            "target_rh_threshold_pct": self.target_rh_threshold_pct,
            "water_condensed_liters_today": self.water_condensed_liters_today,
            "compressor_duty_cycle_pct": self.compressor_duty_cycle_pct,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class DehumidifierRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS dehumidifier_units (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    relative_humidity_pct REAL DEFAULT 52.4,
                    target_rh_threshold_pct REAL DEFAULT 55.0,
                    water_condensed_liters_today REAL DEFAULT 48.5,
                    compressor_duty_cycle_pct INTEGER DEFAULT 40,
                    status TEXT DEFAULT 'HUMIDITY_OPTIMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[DehumidifierUnit]:
        DehumidifierRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM dehumidifier_units ORDER BY unit_code ASC")
            return [DehumidifierUnit(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: DehumidifierUnit) -> bool:
        DehumidifierRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO dehumidifier_units (
                    id, unit_code, zone_id, floor_level,
                    relative_humidity_pct, target_rh_threshold_pct,
                    water_condensed_liters_today,
                    compressor_duty_cycle_pct, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.unit_code, item.zone_id, item.floor_level,
                item.relative_humidity_pct, item.target_rh_threshold_pct,
                item.water_condensed_liters_today,
                item.compressor_duty_cycle_pct, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

DehumidifierRepository.init_table()
