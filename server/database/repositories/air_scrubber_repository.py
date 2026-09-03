"""
SmartPark Air Bio-Scrubber & Particulate Filtration Repository Layer
Manages electrostatic precipitators, HEPA scrubbers, and PM2.5 / PM10 particulate filtration metrics in enclosed parking decks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AirScrubberUnit:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "SCRUB-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1",
        pm25_inflow_ug_m3: float = 68.4,
        pm25_outflow_ug_m3: float = 8.2,
        particulate_filtration_efficiency_pct: float = 88.0,
        hepa_filter_life_remaining_pct: float = 91.4,
        fan_airflow_cfm: int = 4500,
        status: str = "FILTERING_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"scb-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.pm25_inflow_ug_m3 = pm25_inflow_ug_m3
        self.pm25_outflow_ug_m3 = pm25_outflow_ug_m3
        self.particulate_filtration_efficiency_pct = particulate_filtration_efficiency_pct
        self.hepa_filter_life_remaining_pct = hepa_filter_life_remaining_pct
        self.fan_airflow_cfm = fan_airflow_cfm
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "pm25_inflow_ug_m3": self.pm25_inflow_ug_m3,
            "pm25_outflow_ug_m3": self.pm25_outflow_ug_m3,
            "particulate_filtration_efficiency_pct": self.particulate_filtration_efficiency_pct,
            "hepa_filter_life_remaining_pct": self.hepa_filter_life_remaining_pct,
            "fan_airflow_cfm": self.fan_airflow_cfm,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class AirScrubberRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS air_scrubber_units (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    pm25_inflow_ug_m3 REAL DEFAULT 68.4,
                    pm25_outflow_ug_m3 REAL DEFAULT 8.2,
                    particulate_filtration_efficiency_pct REAL DEFAULT 88.0,
                    hepa_filter_life_remaining_pct REAL DEFAULT 91.4,
                    fan_airflow_cfm INTEGER DEFAULT 4500,
                    status TEXT DEFAULT 'FILTERING_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[AirScrubberUnit]:
        AirScrubberRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM air_scrubber_units ORDER BY unit_code ASC")
            return [AirScrubberUnit(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: AirScrubberUnit) -> bool:
        AirScrubberRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO air_scrubber_units (
                    id, unit_code, zone_id, floor_level,
                    pm25_inflow_ug_m3, pm25_outflow_ug_m3,
                    particulate_filtration_efficiency_pct,
                    hepa_filter_life_remaining_pct, fan_airflow_cfm,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.unit_code, item.zone_id, item.floor_level,
                item.pm25_inflow_ug_m3, item.pm25_outflow_ug_m3,
                item.particulate_filtration_efficiency_pct,
                item.hepa_filter_life_remaining_pct,
                item.fan_airflow_cfm, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

AirScrubberRepository.init_table()
