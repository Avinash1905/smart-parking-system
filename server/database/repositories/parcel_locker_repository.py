"""
SmartPark Smart Parcel Delivery Locker Bay Repository Layer
Manages contactless garage package lockers, courier drop-off OTP PINs, and motorized solenoid locker door releases.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ParcelLockerBox:
    def __init__(
        self,
        id: str = "",
        locker_code: str = "BOX-B1-08",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Elevator Lobby",
        locker_size: str = "MEDIUM_PARCEL",  # SMALL | MEDIUM_PARCEL | LARGE_BOX
        recipient_user_id: str = "usr-882",
        carrier_name: str = "FedEx Express",
        tracking_number: str = "748920194812",
        pickup_otp_pin: str = "482910",
        is_occupied: bool = True,
        door_locked: bool = True,
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"lkr-{uuid.uuid4().hex[:8]}"
        self.locker_code = locker_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.locker_size = locker_size
        self.recipient_user_id = recipient_user_id
        self.carrier_name = carrier_name
        self.tracking_number = tracking_number
        self.pickup_otp_pin = pickup_otp_pin
        self.is_occupied = is_occupied
        self.door_locked = door_locked
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "locker_code": self.locker_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "locker_size": self.locker_size,
            "recipient_user_id": self.recipient_user_id,
            "carrier_name": self.carrier_name,
            "tracking_number": self.tracking_number,
            "pickup_otp_pin": self.pickup_otp_pin,
            "is_occupied": self.is_occupied,
            "door_locked": self.door_locked,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ParcelLockerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS parcel_locker_boxes (
                    id TEXT PRIMARY KEY,
                    locker_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    locker_size TEXT DEFAULT 'MEDIUM_PARCEL',
                    recipient_user_id TEXT NOT NULL,
                    carrier_name TEXT NOT NULL,
                    tracking_number TEXT NOT NULL,
                    pickup_otp_pin TEXT NOT NULL,
                    is_occupied INTEGER DEFAULT 1,
                    door_locked INTEGER DEFAULT 1,
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[ParcelLockerBox]:
        ParcelLockerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM parcel_locker_boxes ORDER BY locker_code ASC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["is_occupied"] = bool(d["is_occupied"])
                d["door_locked"] = bool(d["door_locked"])
                res.append(ParcelLockerBox(**d))
            return res

    @staticmethod
    def create(item: ParcelLockerBox) -> bool:
        ParcelLockerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO parcel_locker_boxes (
                    id, locker_code, zone_id, floor_level,
                    locker_size, recipient_user_id, carrier_name,
                    tracking_number, pickup_otp_pin, is_occupied,
                    door_locked, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.locker_code, item.zone_id,
                item.floor_level, item.locker_size,
                item.recipient_user_id, item.carrier_name,
                item.tracking_number, item.pickup_otp_pin,
                1 if item.is_occupied else 0,
                1 if item.door_locked else 0, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

ParcelLockerRepository.init_table()
