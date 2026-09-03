"""
SmartPark Airport Long-Term Valet & Flight Tracking Repository Layer
Manages airport terminal parking reservations, return flight numbers, and terminal shuttle dispatch.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AirportReservation:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        airport_code: str = "BLR",
        airport_name: str = "Kempegowda International Airport (BLR)",
        departure_terminal: str = "TERMINAL_2",
        return_flight_number: str = "6E-5021",
        vehicle_plate: str = "KA-01-MJ-5890",
        valet_curbside_pickup: bool = True,
        days_parked: int = 4,
        total_fare: float = 1800.0,
        flight_status: str = "ON_TIME",  # ON_TIME | DELAYED | LANDED
        status: str = "CONFIRMED",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"air-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.airport_code = airport_code
        self.airport_name = airport_name
        self.departure_terminal = departure_terminal
        self.return_flight_number = return_flight_number.upper().strip()
        self.vehicle_plate = vehicle_plate
        self.valet_curbside_pickup = valet_curbside_pickup
        self.days_parked = days_parked
        self.total_fare = total_fare
        self.flight_status = flight_status
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "airport_code": self.airport_code,
            "airport_name": self.airport_name,
            "departure_terminal": self.departure_terminal,
            "return_flight_number": self.return_flight_number,
            "vehicle_plate": self.vehicle_plate,
            "valet_curbside_pickup": self.valet_curbside_pickup,
            "days_parked": self.days_parked,
            "total_fare": self.total_fare,
            "flight_status": self.flight_status,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class AirportParkingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS airport_reservations (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    airport_code TEXT NOT NULL,
                    airport_name TEXT NOT NULL,
                    departure_terminal TEXT DEFAULT 'TERMINAL_2',
                    return_flight_number TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    valet_curbside_pickup INTEGER DEFAULT 1,
                    days_parked INTEGER DEFAULT 4,
                    total_fare REAL DEFAULT 1800.0,
                    flight_status TEXT DEFAULT 'ON_TIME',
                    status TEXT DEFAULT 'CONFIRMED',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(res: AirportReservation) -> bool:
        AirportParkingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO airport_reservations (
                    id, user_id, airport_code, airport_name,
                    departure_terminal, return_flight_number,
                    vehicle_plate, valet_curbside_pickup, days_parked,
                    total_fare, flight_status, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                res.id, res.user_id, res.airport_code, res.airport_name,
                res.departure_terminal, res.return_flight_number,
                res.vehicle_plate, 1 if res.valet_curbside_pickup else 0,
                res.days_parked, res.total_fare, res.flight_status,
                res.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_by_user(user_id: str) -> List[AirportReservation]:
        AirportParkingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM airport_reservations WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["valet_curbside_pickup"] = bool(d["valet_curbside_pickup"])
                res.append(AirportReservation(**d))
            return res

AirportParkingRepository.init_table()
