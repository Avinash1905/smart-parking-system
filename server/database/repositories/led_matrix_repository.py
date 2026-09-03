"""
SmartPark Overhead Ultrasonic LED Strip Light Matrix Repository Layer
Manages addressable RGB LED indicator strips mounted above each parking bay (Green = Vacant, Red = Occupied, Cyan = EV).
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class LEDMatrixStrip:
    def __init__(
        self,
        id: str = "",
        slot_code: str = "A-01",
        zone_id: str = "zone-pub-01",
        led_color_state: str = "GREEN",  # GREEN | RED | CYAN_EV | BLUE_VIP | AMBER_RESERVED
        brightness_level_pct: int = 100,
        ultrasonic_distance_cm: float = 340.0,
        hardware_fault: bool = False,
        status: str = "ONLINE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"led-{uuid.uuid4().hex[:8]}"
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.led_color_state = led_color_state
        self.brightness_level_pct = brightness_level_pct
        self.ultrasonic_distance_cm = ultrasonic_distance_cm
        self.hardware_fault = hardware_fault
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "led_color_state": self.led_color_state,
            "brightness_level_pct": self.brightness_level_pct,
            "ultrasonic_distance_cm": self.ultrasonic_distance_cm,
            "hardware_fault": self.hardware_fault,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class LEDMatrixRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS led_matrix_strips (
                    id TEXT PRIMARY KEY,
                    slot_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    led_color_state TEXT DEFAULT 'GREEN',
                    brightness_level_pct INTEGER DEFAULT 100,
                    ultrasonic_distance_cm REAL DEFAULT 340.0,
                    hardware_fault INTEGER DEFAULT 0,
                    status TEXT DEFAULT 'ONLINE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_by_zone(zone_id: str = "zone-pub-01") -> List[LEDMatrixStrip]:
        LEDMatrixRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM led_matrix_strips WHERE zone_id = ? ORDER BY slot_code ASC", (zone_id,))
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["hardware_fault"] = bool(d["hardware_fault"])
                res.append(LEDMatrixStrip(**d))
            return res

    @staticmethod
    def create(item: LEDMatrixStrip) -> bool:
        LEDMatrixRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO led_matrix_strips (
                    id, slot_code, zone_id, led_color_state,
                    brightness_level_pct, ultrasonic_distance_cm,
                    hardware_fault, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.slot_code, item.zone_id, item.led_color_state,
                item.brightness_level_pct, item.ultrasonic_distance_cm,
                1 if item.hardware_fault else 0, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

LEDMatrixRepository.init_table()
