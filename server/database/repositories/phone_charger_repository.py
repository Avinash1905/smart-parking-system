"""
SmartPark Driver Lounge Qi Fast Wireless Phone Charger Lockbox Repository Layer
Manages 15W Qi wireless magnetic inductive charging lockers, NFC badge / OTP PIN security, and driver lounge smartphone amenities.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PhoneChargerLocker:
    def __init__(
        self,
        id: str = "",
        locker_code: str = "PHONE-LOCKER-03",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor G Waiting Lounge",
        qi_charging_power_w: float = 15.0,
        battery_charge_current_pct: int = 82,
        access_pin_code: str = "9182",
        is_occupied: bool = True,
        door_solenoid_locked: bool = True,
        charging_state: str = "FAST_WIRELESS_CHARGING_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"pcl-{uuid.uuid4().hex[:8]}"
        self.locker_code = locker_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.qi_charging_power_w = qi_charging_power_w
        self.battery_charge_current_pct = battery_charge_current_pct
        self.access_pin_code = access_pin_code
        self.is_occupied = is_occupied
        self.door_solenoid_locked = door_solenoid_locked
        self.charging_state = charging_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "locker_code": self.locker_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "qi_charging_power_w": self.qi_charging_power_w,
            "battery_charge_current_pct": self.battery_charge_current_pct,
            "access_pin_code": self.access_pin_code,
            "is_occupied": self.is_occupied,
            "door_solenoid_locked": self.door_solenoid_locked,
            "charging_state": self.charging_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PhoneChargerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS phone_charger_lockers (
                    id TEXT PRIMARY KEY,
                    locker_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    qi_charging_power_w REAL DEFAULT 15.0,
                    battery_charge_current_pct INTEGER DEFAULT 82,
                    access_pin_code TEXT DEFAULT '9182',
                    is_occupied INTEGER DEFAULT 1,
                    door_solenoid_locked INTEGER DEFAULT 1,
                    charging_state TEXT DEFAULT 'FAST_WIRELESS_CHARGING_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> PhoneChargerLocker:
        PhoneChargerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM phone_charger_lockers WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["is_occupied"] = bool(d["is_occupied"])
                d["door_solenoid_locked"] = bool(d["door_solenoid_locked"])
                return PhoneChargerLocker(**d)
            locker = PhoneChargerLocker(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO phone_charger_lockers (
                    id, locker_code, zone_id, floor_level,
                    qi_charging_power_w, battery_charge_current_pct,
                    access_pin_code, is_occupied,
                    door_solenoid_locked, charging_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                locker.id, locker.locker_code, locker.zone_id,
                locker.floor_level, locker.qi_charging_power_w,
                locker.battery_charge_current_pct,
                locker.access_pin_code,
                1 if locker.is_occupied else 0,
                1 if locker.door_solenoid_locked else 0,
                locker.charging_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return locker

PhoneChargerRepository.init_table()
