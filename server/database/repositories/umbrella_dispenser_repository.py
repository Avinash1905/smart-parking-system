"""
SmartPark Contactless Rain Umbrella Dispenser & Return Carousel Repository Layer
Manages motorized carousel umbrella dispensers, weather rain sensor automatic triggers, RFID return slots, and zero-waste commuter mobility.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class UmbrellaDispenserStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "UMBRELLA-POD-G-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Ground Floor Pedestrian Exit",
        available_umbrellas_count: int = 32,
        total_capacity: int = 40,
        rain_sensor_tripped: bool = True,
        unlocked_umbrella_rfid_tag: str = "UMB-RFID-109",
        status: str = "READY_TO_DISPENSE_RAIN_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"uds-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.available_umbrellas_count = available_umbrellas_count
        self.total_capacity = total_capacity
        self.rain_sensor_tripped = rain_sensor_tripped
        self.unlocked_umbrella_rfid_tag = unlocked_umbrella_rfid_tag
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "available_umbrellas_count": self.available_umbrellas_count,
            "total_capacity": self.total_capacity,
            "rain_sensor_tripped": self.rain_sensor_tripped,
            "unlocked_umbrella_rfid_tag": self.unlocked_umbrella_rfid_tag,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class UmbrellaDispenserRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS umbrella_dispenser_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    available_umbrellas_count INTEGER DEFAULT 32,
                    total_capacity INTEGER DEFAULT 40,
                    rain_sensor_tripped INTEGER DEFAULT 1,
                    unlocked_umbrella_rfid_tag TEXT DEFAULT 'UMB-RFID-109',
                    status TEXT DEFAULT 'READY_TO_DISPENSE_RAIN_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> UmbrellaDispenserStation:
        UmbrellaDispenserRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM umbrella_dispenser_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["rain_sensor_tripped"] = bool(d["rain_sensor_tripped"])
                return UmbrellaDispenserStation(**d)
            station = UmbrellaDispenserStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO umbrella_dispenser_stations (
                    id, station_code, zone_id, floor_level,
                    available_umbrellas_count, total_capacity,
                    rain_sensor_tripped, unlocked_umbrella_rfid_tag,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level, station.available_umbrellas_count,
                station.total_capacity,
                1 if station.rain_sensor_tripped else 0,
                station.unlocked_umbrella_rfid_tag,
                station.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

UmbrellaDispenserRepository.init_table()
