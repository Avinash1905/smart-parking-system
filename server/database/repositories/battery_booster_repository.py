"""
SmartPark Portable Magnetic Power Bank Rental Dispenser Repository Layer
Manages 10,000mAh magnetic MagSafe/USB-C fast-charging power banks, RFID automated rental slots, and free 60-minute driver battery loan credits.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BatteryBoosterStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "POWERBANK-STATION-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor G Waiting Lounge Kiosk",
        available_powerbanks_count: int = 18,
        total_capacity: int = 24,
        powerbank_capacity_mah: int = 10000,
        fast_charge_power_w: float = 22.5,
        dispenser_solenoid_state: str = "SLOT_LOCKED_STANDBY",
        status: str = "POWERBANKS_READY_TO_RENT",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"bbs-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.available_powerbanks_count = available_powerbanks_count
        self.total_capacity = total_capacity
        self.powerbank_capacity_mah = powerbank_capacity_mah
        self.fast_charge_power_w = fast_charge_power_w
        self.dispenser_solenoid_state = dispenser_solenoid_state
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "available_powerbanks_count": self.available_powerbanks_count,
            "total_capacity": self.total_capacity,
            "powerbank_capacity_mah": self.powerbank_capacity_mah,
            "fast_charge_power_w": self.fast_charge_power_w,
            "dispenser_solenoid_state": self.dispenser_solenoid_state,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BatteryBoosterRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS battery_booster_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    available_powerbanks_count INTEGER DEFAULT 18,
                    total_capacity INTEGER DEFAULT 24,
                    powerbank_capacity_mah INTEGER DEFAULT 10000,
                    fast_charge_power_w REAL DEFAULT 22.5,
                    dispenser_solenoid_state TEXT DEFAULT 'SLOT_LOCKED_STANDBY',
                    status TEXT DEFAULT 'POWERBANKS_READY_TO_RENT',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> BatteryBoosterStation:
        BatteryBoosterRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM battery_booster_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return BatteryBoosterStation(**dict(row))
            station = BatteryBoosterStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO battery_booster_stations (
                    id, station_code, zone_id, floor_level,
                    available_powerbanks_count, total_capacity,
                    powerbank_capacity_mah, fast_charge_power_w,
                    dispenser_solenoid_state, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level,
                station.available_powerbanks_count,
                station.total_capacity,
                station.powerbank_capacity_mah,
                station.fast_charge_power_w,
                station.dispenser_solenoid_state,
                station.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

BatteryBoosterRepository.init_table()
