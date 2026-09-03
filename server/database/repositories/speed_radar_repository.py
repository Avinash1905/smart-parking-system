"""
SmartPark Drive Aisle Speed Radar & Velocity Violation Issuer Repository Layer
Manages 24GHz radar speed traps, ANPR time-over-distance timing, and automated speeding violation citations (15 km/h limit).
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SpeedRadarIncident:
    def __init__(
        self,
        id: str = "",
        incident_code: str = "SPEED-INC-9014",
        vehicle_plate: str = "KA-01-EQ-9988",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Main Aisle",
        measured_speed_kmh: float = 26.5,
        posted_speed_limit_kmh: float = 15.0,
        speed_over_limit_kmh: float = 11.5,
        fine_amount_inr: float = 500.0,
        violation_status: str = "SPEEDING_CITATION_ISSUED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"spd-{uuid.uuid4().hex[:8]}"
        self.incident_code = incident_code
        self.vehicle_plate = vehicle_plate
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_speed_kmh = measured_speed_kmh
        self.posted_speed_limit_kmh = posted_speed_limit_kmh
        self.speed_over_limit_kmh = speed_over_limit_kmh
        self.fine_amount_inr = fine_amount_inr
        self.violation_status = violation_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "incident_code": self.incident_code,
            "vehicle_plate": self.vehicle_plate,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_speed_kmh": self.measured_speed_kmh,
            "posted_speed_limit_kmh": self.posted_speed_limit_kmh,
            "speed_over_limit_kmh": self.speed_over_limit_kmh,
            "fine_amount_inr": self.fine_amount_inr,
            "violation_status": self.violation_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SpeedRadarRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS speed_radar_incidents (
                    id TEXT PRIMARY KEY,
                    incident_code TEXT UNIQUE NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_speed_kmh REAL DEFAULT 26.5,
                    posted_speed_limit_kmh REAL DEFAULT 15.0,
                    speed_over_limit_kmh REAL DEFAULT 11.5,
                    fine_amount_inr REAL DEFAULT 500.0,
                    violation_status TEXT DEFAULT 'SPEEDING_CITATION_ISSUED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[SpeedRadarIncident]:
        SpeedRadarRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM speed_radar_incidents ORDER BY timestamp DESC")
            return [SpeedRadarIncident(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: SpeedRadarIncident) -> bool:
        SpeedRadarRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO speed_radar_incidents (
                    id, incident_code, vehicle_plate, zone_id,
                    floor_level, measured_speed_kmh,
                    posted_speed_limit_kmh, speed_over_limit_kmh,
                    fine_amount_inr, violation_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.incident_code, item.vehicle_plate,
                item.zone_id, item.floor_level,
                item.measured_speed_kmh, item.posted_speed_limit_kmh,
                item.speed_over_limit_kmh, item.fine_amount_inr,
                item.violation_status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

SpeedRadarRepository.init_table()
