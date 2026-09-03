"""
SmartPark Autonomous Patrol Drone Docking Hangar Repository Layer
Manages rooftop drone nests, automated induction battery charging, and scheduled perimeter surveillance flights.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PatrolDroneHangar:
    def __init__(
        self,
        id: str = "",
        hangar_code: str = "DRONE-NEST-ROOF-01",
        zone_id: str = "zone-pub-01",
        drone_callsign: str = "SMARTPARK-SKY-GUARD-01",
        battery_charge_pct: int = 98,
        hangar_door_state: str = "WEATHER_SEALED_CLOSED",  # WEATHER_SEALED_CLOSED | OPENING | OPEN_FLIGHT_DECK
        last_flight_duration_minutes: int = 24,
        next_scheduled_patrol: str = "Tonight, 11:00 PM",
        flight_status: str = "CHARGING_ON_PAD",  # CHARGING_ON_PAD | IN_FLIGHT_SURVEILLANCE | LANDING_RETURN
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"drn-{uuid.uuid4().hex[:8]}"
        self.hangar_code = hangar_code
        self.zone_id = zone_id
        self.drone_callsign = drone_callsign
        self.battery_charge_pct = battery_charge_pct
        self.hangar_door_state = hangar_door_state
        self.last_flight_duration_minutes = last_flight_duration_minutes
        self.next_scheduled_patrol = next_scheduled_patrol
        self.flight_status = flight_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "hangar_code": self.hangar_code,
            "zone_id": self.zone_id,
            "drone_callsign": self.drone_callsign,
            "battery_charge_pct": self.battery_charge_pct,
            "hangar_door_state": self.hangar_door_state,
            "last_flight_duration_minutes": self.last_flight_duration_minutes,
            "next_scheduled_patrol": self.next_scheduled_patrol,
            "flight_status": self.flight_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PatrolDroneRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS patrol_drone_hangars (
                    id TEXT PRIMARY KEY,
                    hangar_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    drone_callsign TEXT NOT NULL,
                    battery_charge_pct INTEGER DEFAULT 98,
                    hangar_door_state TEXT DEFAULT 'WEATHER_SEALED_CLOSED',
                    last_flight_duration_minutes INTEGER DEFAULT 24,
                    next_scheduled_patrol TEXT NOT NULL,
                    flight_status TEXT DEFAULT 'CHARGING_ON_PAD',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> PatrolDroneHangar:
        PatrolDroneRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM patrol_drone_hangars WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return PatrolDroneHangar(**dict(row))
            hangar = PatrolDroneHangar(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO patrol_drone_hangars (
                    id, hangar_code, zone_id, drone_callsign,
                    battery_charge_pct, hangar_door_state,
                    last_flight_duration_minutes, next_scheduled_patrol,
                    flight_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                hangar.id, hangar.hangar_code, hangar.zone_id,
                hangar.drone_callsign, hangar.battery_charge_pct,
                hangar.hangar_door_state,
                hangar.last_flight_duration_minutes,
                hangar.next_scheduled_patrol, hangar.flight_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return hangar

PatrolDroneRepository.init_table()
