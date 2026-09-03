"""
SmartPark Complimentary High-Power Vehicle Vacuum Cleaner & Interior Detailing Kiosk Repository Layer
Manages 5.5 HP cyclonic dual-motor vacuum wands, compressed air crevices blowers, cabin fragrance dispensers, and driver care amenities.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class VacuumDetailerStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "VACUUM-CARE-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Driver Auto Care Bay",
        cyclonic_suction_power_hp: float = 5.5,
        hose_airflow_cfm: float = 240.0,
        fragrance_dispenser_scent: str = "NEW_CAR_CEDARWOOD",
        cycles_completed_today: int = 28,
        station_status: str = "VACUUM_HOSE_READY_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"vds-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.cyclonic_suction_power_hp = cyclonic_suction_power_hp
        self.hose_airflow_cfm = hose_airflow_cfm
        self.fragrance_dispenser_scent = fragrance_dispenser_scent
        self.cycles_completed_today = cycles_completed_today
        self.station_status = station_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "cyclonic_suction_power_hp": self.cyclonic_suction_power_hp,
            "hose_airflow_cfm": self.hose_airflow_cfm,
            "fragrance_dispenser_scent": self.fragrance_dispenser_scent,
            "cycles_completed_today": self.cycles_completed_today,
            "station_status": self.station_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class VacuumDetailerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vacuum_detailer_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    cyclonic_suction_power_hp REAL DEFAULT 5.5,
                    hose_airflow_cfm REAL DEFAULT 240.0,
                    fragrance_dispenser_scent TEXT DEFAULT 'NEW_CAR_CEDARWOOD',
                    cycles_completed_today INTEGER DEFAULT 28,
                    station_status TEXT DEFAULT 'VACUUM_HOSE_READY_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> VacuumDetailerStation:
        VacuumDetailerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM vacuum_detailer_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return VacuumDetailerStation(**dict(row))
            station = VacuumDetailerStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO vacuum_detailer_stations (
                    id, station_code, zone_id, floor_level,
                    cyclonic_suction_power_hp, hose_airflow_cfm,
                    fragrance_dispenser_scent,
                    cycles_completed_today, station_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level, station.cyclonic_suction_power_hp,
                station.hose_airflow_cfm,
                station.fragrance_dispenser_scent,
                station.cycles_completed_today,
                station.station_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

VacuumDetailerRepository.init_table()
