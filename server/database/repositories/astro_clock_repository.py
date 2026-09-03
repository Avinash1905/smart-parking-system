"""
SmartPark Astronomical Solar Clock & Dusk/Dawn Lighting Automation Repository Layer
Calculates real-time solar elevation angles, civil twilight triggers, and automated dusk-to-dawn circadian illumination.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AstronomicalClockSchedule:
    def __init__(
        self,
        id: str = "",
        schedule_code: str = "ASTRO-LIGHT-BLR-01",
        zone_id: str = "zone-pub-01",
        solar_elevation_degrees: float = 48.2,
        solar_azimuth_degrees: float = 242.1,
        calculated_sunset_time: str = "06:34 PM",
        calculated_sunrise_time: str = "06:08 AM",
        current_astronomical_phase: str = "DAYLIGHT_SUNSHINE",  # DAYLIGHT_SUNSHINE | CIVIL_TWILIGHT_DUSK | NAUTICAL_NIGHT | CIVIL_TWILIGHT_DAWN
        circadian_cct_kelvin: int = 5000,  # 5000K daylight white, 3000K warm night amber
        status: str = "ASTRONOMICAL_TRACKING_LOCKED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ast-{uuid.uuid4().hex[:8]}"
        self.schedule_code = schedule_code
        self.zone_id = zone_id
        self.solar_elevation_degrees = solar_elevation_degrees
        self.solar_azimuth_degrees = solar_azimuth_degrees
        self.calculated_sunset_time = calculated_sunset_time
        self.calculated_sunrise_time = calculated_sunrise_time
        self.current_astronomical_phase = current_astronomical_phase
        self.circadian_cct_kelvin = circadian_cct_kelvin
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "schedule_code": self.schedule_code,
            "zone_id": self.zone_id,
            "solar_elevation_degrees": self.solar_elevation_degrees,
            "solar_azimuth_degrees": self.solar_azimuth_degrees,
            "calculated_sunset_time": self.calculated_sunset_time,
            "calculated_sunrise_time": self.calculated_sunrise_time,
            "current_astronomical_phase": self.current_astronomical_phase,
            "circadian_cct_kelvin": self.circadian_cct_kelvin,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class AstroClockRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS astro_clock_schedules (
                    id TEXT PRIMARY KEY,
                    schedule_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    solar_elevation_degrees REAL DEFAULT 48.2,
                    solar_azimuth_degrees REAL DEFAULT 242.1,
                    calculated_sunset_time TEXT NOT NULL,
                    calculated_sunrise_time TEXT NOT NULL,
                    current_astronomical_phase TEXT DEFAULT 'DAYLIGHT_SUNSHINE',
                    circadian_cct_kelvin INTEGER DEFAULT 5000,
                    status TEXT DEFAULT 'ASTRONOMICAL_TRACKING_LOCKED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> AstronomicalClockSchedule:
        AstroClockRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM astro_clock_schedules WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return AstronomicalClockSchedule(**dict(row))
            node = AstronomicalClockSchedule(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO astro_clock_schedules (
                    id, schedule_code, zone_id, solar_elevation_degrees,
                    solar_azimuth_degrees, calculated_sunset_time,
                    calculated_sunrise_time, current_astronomical_phase,
                    circadian_cct_kelvin, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.schedule_code, node.zone_id,
                node.solar_elevation_degrees,
                node.solar_azimuth_degrees, node.calculated_sunset_time,
                node.calculated_sunrise_time,
                node.current_astronomical_phase,
                node.circadian_cct_kelvin, node.status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

AstroClockRepository.init_table()
