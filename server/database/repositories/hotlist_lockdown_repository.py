"""
SmartPark Stolen Vehicle Police Hotlist & Automatic Gate Lockdown Repository Layer
Manages law enforcement NCIC/CCTNS database hits, automatic barrier descent, and silent alarm dispatches.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class HotlistLockdownEvent:
    def __init__(
        self,
        id: str = "",
        incident_code: str = "POL-LOCK-091",
        vehicle_plate: str = "KA-04-E-1337",
        crime_category: str = "FELONY_VEHICLE_THEFT",
        approaching_gate_code: str = "GATE-NORTH-BARRIER-01",
        boom_barrier_override: str = "EMERGENCY_DROP_LOCKED",
        police_precinct_dispatched: str = "Cubbon Park Police Station (Ctrl #4)",
        status: str = "CONTAINED_LOCKDOWN",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"hlk-{uuid.uuid4().hex[:8]}"
        self.incident_code = incident_code
        self.vehicle_plate = vehicle_plate
        self.crime_category = crime_category
        self.approaching_gate_code = approaching_gate_code
        self.boom_barrier_override = boom_barrier_override
        self.police_precinct_dispatched = police_precinct_dispatched
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "incident_code": self.incident_code,
            "vehicle_plate": self.vehicle_plate,
            "crime_category": self.crime_category,
            "approaching_gate_code": self.approaching_gate_code,
            "boom_barrier_override": self.boom_barrier_override,
            "police_precinct_dispatched": self.police_precinct_dispatched,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class HotlistLockdownRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS hotlist_lockdown_events (
                    id TEXT PRIMARY KEY,
                    incident_code TEXT UNIQUE NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    crime_category TEXT NOT NULL,
                    approaching_gate_code TEXT NOT NULL,
                    boom_barrier_override TEXT DEFAULT 'EMERGENCY_DROP_LOCKED',
                    police_precinct_dispatched TEXT NOT NULL,
                    status TEXT DEFAULT 'CONTAINED_LOCKDOWN',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[HotlistLockdownEvent]:
        HotlistLockdownRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM hotlist_lockdown_events ORDER BY timestamp DESC")
            return [HotlistLockdownEvent(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: HotlistLockdownEvent) -> bool:
        HotlistLockdownRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO hotlist_lockdown_events (
                    id, incident_code, vehicle_plate, crime_category,
                    approaching_gate_code, boom_barrier_override,
                    police_precinct_dispatched, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.incident_code, item.vehicle_plate,
                item.crime_category, item.approaching_gate_code,
                item.boom_barrier_override,
                item.police_precinct_dispatched, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

HotlistLockdownRepository.init_table()
