"""
SmartPark Driver Cabin Air Sanitization & Windshield Defogging Kiosk Repository Layer
Manages complimentary vehicle interior HEPA air purifiers, ozone-free odor neutralizers, and anti-fog ceramic coatings.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CabinAirStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "CABIN-AIR-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Driver Service Bay",
        hepa_air_purifier_airflow_cfm: float = 350.0,
        voc_neutralizer_tank_pct: float = 94.0,
        anti_fog_spray_reservoir_pct: float = 88.5,
        cycles_dispensed_today: int = 42,
        station_status: str = "SERVICE_BAY_READY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"cas-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.hepa_air_purifier_airflow_cfm = hepa_air_purifier_airflow_cfm
        self.voc_neutralizer_tank_pct = voc_neutralizer_tank_pct
        self.anti_fog_spray_reservoir_pct = anti_fog_spray_reservoir_pct
        self.cycles_dispensed_today = cycles_dispensed_today
        self.station_status = station_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "hepa_air_purifier_airflow_cfm": self.hepa_air_purifier_airflow_cfm,
            "voc_neutralizer_tank_pct": self.voc_neutralizer_tank_pct,
            "anti_fog_spray_reservoir_pct": self.anti_fog_spray_reservoir_pct,
            "cycles_dispensed_today": self.cycles_dispensed_today,
            "station_status": self.station_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CabinAirRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cabin_air_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    hepa_air_purifier_airflow_cfm REAL DEFAULT 350.0,
                    voc_neutralizer_tank_pct REAL DEFAULT 94.0,
                    anti_fog_spray_reservoir_pct REAL DEFAULT 88.5,
                    cycles_dispensed_today INTEGER DEFAULT 42,
                    station_status TEXT DEFAULT 'SERVICE_BAY_READY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> CabinAirStation:
        CabinAirRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cabin_air_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return CabinAirStation(**dict(row))
            station = CabinAirStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO cabin_air_stations (
                    id, station_code, zone_id, floor_level,
                    hepa_air_purifier_airflow_cfm,
                    voc_neutralizer_tank_pct,
                    anti_fog_spray_reservoir_pct,
                    cycles_dispensed_today, station_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level,
                station.hepa_air_purifier_airflow_cfm,
                station.voc_neutralizer_tank_pct,
                station.anti_fog_spray_reservoir_pct,
                station.cycles_dispensed_today,
                station.station_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

CabinAirRepository.init_table()
