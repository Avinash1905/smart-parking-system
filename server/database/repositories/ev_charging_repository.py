"""
SmartPark EV Charging Station & Smart Grid Repository Layer
Manages EV stalls, charging power ratings (22kW AC / 60kW DC Fast Charge), session metrics, and kWh billing.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class EVChargingSession:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        vehicle_plate: str = "",
        zone_id: str = "",
        zone_name: str = "",
        stall_id: str = "EV-STALL-01",
        connector_type: str = "CCS2_FAST_CHARGE",  # CCS2_FAST_CHARGE | TYPE_2_AC | CHADEMO
        power_output_kw: float = 60.0,
        energy_delivered_kwh: float = 0.0,
        rate_per_kwh: float = 14.5,
        session_cost: float = 0.0,
        co2_saved_kg: float = 0.0,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        status: str = "IN_PROGRESS"  # IN_PROGRESS | COMPLETED | FAULTED
    ):
        self.id = id or f"ev-sess-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.vehicle_plate = vehicle_plate
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.stall_id = stall_id
        self.connector_type = connector_type
        self.power_output_kw = power_output_kw
        self.energy_delivered_kwh = energy_delivered_kwh
        self.rate_per_kwh = rate_per_kwh
        self.session_cost = session_cost
        self.co2_saved_kg = co2_saved_kg
        self.start_time = start_time or datetime.utcnow()
        self.end_time = end_time
        self.status = status

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "vehicle_plate": self.vehicle_plate,
            "zone_id": self.zone_id,
            "zone_name": self.zone_name,
            "stall_id": self.stall_id,
            "connector_type": self.connector_type,
            "power_output_kw": self.power_output_kw,
            "energy_delivered_kwh": self.energy_delivered_kwh,
            "rate_per_kwh": self.rate_per_kwh,
            "session_cost": self.session_cost,
            "co2_saved_kg": self.co2_saved_kg,
            "start_time": self.start_time.isoformat() if isinstance(self.start_time, datetime) else self.start_time,
            "end_time": self.end_time.isoformat() if isinstance(self.end_time, datetime) and self.end_time else None,
            "status": self.status
        }

class EVChargingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ev_charging_sessions (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    zone_name TEXT,
                    stall_id TEXT NOT NULL,
                    connector_type TEXT DEFAULT 'CCS2_FAST_CHARGE',
                    power_output_kw REAL DEFAULT 60.0,
                    energy_delivered_kwh REAL DEFAULT 0.0,
                    rate_per_kwh REAL DEFAULT 14.5,
                    session_cost REAL DEFAULT 0.0,
                    co2_saved_kg REAL DEFAULT 0.0,
                    start_time TEXT,
                    end_time TEXT,
                    status TEXT DEFAULT 'IN_PROGRESS'
                )
            """)
            conn.commit()

    @staticmethod
    def create(sess: EVChargingSession) -> bool:
        EVChargingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO ev_charging_sessions (
                    id, user_id, vehicle_plate, zone_id, zone_name, stall_id,
                    connector_type, power_output_kw, energy_delivered_kwh,
                    rate_per_kwh, session_cost, co2_saved_kg, start_time,
                    end_time, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                sess.id, sess.user_id, sess.vehicle_plate, sess.zone_id,
                sess.zone_name, sess.stall_id, sess.connector_type,
                sess.power_output_kw, sess.energy_delivered_kwh,
                sess.rate_per_kwh, sess.session_cost, sess.co2_saved_kg,
                sess.start_time.isoformat() if isinstance(sess.start_time, datetime) else sess.start_time,
                sess.end_time.isoformat() if isinstance(sess.end_time, datetime) and sess.end_time else None,
                sess.status
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_by_user(user_id: str) -> List[EVChargingSession]:
        EVChargingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ev_charging_sessions WHERE user_id = ? ORDER BY start_time DESC", (user_id,))
            return [EVChargingSession(**dict(r)) for r in cursor.fetchall()]

EVChargingRepository.init_table()
