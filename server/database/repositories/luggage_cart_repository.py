"""
SmartPark Driver Luggage & Shopping Cart Automated Dispenser Repository Layer
Manages RFID motorized shopping cart docking bays, cashless mobile app unlocking, and automated deposit refund reward points.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class LuggageCartBay:
    def __init__(
        self,
        id: str = "",
        bay_code: str = "CART-CORRAL-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Elevator Vestibule",
        available_carts_count: int = 14,
        total_capacity: int = 20,
        unlocked_cart_rfid_tag: str = "CART-RFID-904",
        dispenser_solenoid_state: str = "DOCK_LOCKED_STANDBY",
        reward_points_credit_inr: float = 10.0,
        status: str = "CARTS_READY_TO_DISPENSE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"lcb-{uuid.uuid4().hex[:8]}"
        self.bay_code = bay_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.available_carts_count = available_carts_count
        self.total_capacity = total_capacity
        self.unlocked_cart_rfid_tag = unlocked_cart_rfid_tag
        self.dispenser_solenoid_state = dispenser_solenoid_state
        self.reward_points_credit_inr = reward_points_credit_inr
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "bay_code": self.bay_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "available_carts_count": self.available_carts_count,
            "total_capacity": self.total_capacity,
            "unlocked_cart_rfid_tag": self.unlocked_cart_rfid_tag,
            "dispenser_solenoid_state": self.dispenser_solenoid_state,
            "reward_points_credit_inr": self.reward_points_credit_inr,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class LuggageCartRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS luggage_cart_bays (
                    id TEXT PRIMARY KEY,
                    bay_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    available_carts_count INTEGER DEFAULT 14,
                    total_capacity INTEGER DEFAULT 20,
                    unlocked_cart_rfid_tag TEXT DEFAULT 'CART-RFID-904',
                    dispenser_solenoid_state TEXT DEFAULT 'DOCK_LOCKED_STANDBY',
                    reward_points_credit_inr REAL DEFAULT 10.0,
                    status TEXT DEFAULT 'CARTS_READY_TO_DISPENSE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> LuggageCartBay:
        LuggageCartRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM luggage_cart_bays WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return LuggageCartBay(**dict(row))
            bay = LuggageCartBay(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO luggage_cart_bays (
                    id, bay_code, zone_id, floor_level,
                    available_carts_count, total_capacity,
                    unlocked_cart_rfid_tag, dispenser_solenoid_state,
                    reward_points_credit_inr, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                bay.id, bay.bay_code, bay.zone_id, bay.floor_level,
                bay.available_carts_count, bay.total_capacity,
                bay.unlocked_cart_rfid_tag,
                bay.dispenser_solenoid_state,
                bay.reward_points_credit_inr, bay.status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return bay

LuggageCartRepository.init_table()
