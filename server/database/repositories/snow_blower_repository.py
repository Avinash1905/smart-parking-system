"""
SmartPark Autonomous Rooftop Snow Blower & Sweeper Rover Repository Layer
Manages high-torque electric dual-stage snow blowers, heated directional discharge chutes, and rooftop snow depth clearance.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SnowBlowerRoverBot:
    def __init__(
        self,
        id: str = "",
        rover_code: str = "SNOW-BLOWER-ROOF-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Open Parking Deck",
        battery_charge_pct: int = 96,
        snow_depth_cleared_cm: float = 14.5,
        deck_area_cleared_sq_m: float = 3400.0,
        heated_chute_active: bool = True,
        auger_impeller_speed_rpm: int = 1850,
        operational_state: str = "DOCK_CHARGER_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"sbr-{uuid.uuid4().hex[:8]}"
        self.rover_code = rover_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.battery_charge_pct = battery_charge_pct
        self.snow_depth_cleared_cm = snow_depth_cleared_cm
        self.deck_area_cleared_sq_m = deck_area_cleared_sq_m
        self.heated_chute_active = heated_chute_active
        self.auger_impeller_speed_rpm = auger_impeller_speed_rpm
        self.operational_state = operational_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "rover_code": self.rover_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "battery_charge_pct": self.battery_charge_pct,
            "snow_depth_cleared_cm": self.snow_depth_cleared_cm,
            "deck_area_cleared_sq_m": self.deck_area_cleared_sq_m,
            "heated_chute_active": self.heated_chute_active,
            "auger_impeller_speed_rpm": self.auger_impeller_speed_rpm,
            "operational_state": self.operational_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SnowBlowerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS snow_blower_rover_bots (
                    id TEXT PRIMARY KEY,
                    rover_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    battery_charge_pct INTEGER DEFAULT 96,
                    snow_depth_cleared_cm REAL DEFAULT 14.5,
                    deck_area_cleared_sq_m REAL DEFAULT 3400.0,
                    heated_chute_active INTEGER DEFAULT 1,
                    auger_impeller_speed_rpm INTEGER DEFAULT 1850,
                    operational_state TEXT DEFAULT 'DOCK_CHARGER_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SnowBlowerRoverBot:
        SnowBlowerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM snow_blower_rover_bots WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["heated_chute_active"] = bool(d["heated_chute_active"])
                return SnowBlowerRoverBot(**d)
            bot = SnowBlowerRoverBot(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO snow_blower_rover_bots (
                    id, rover_code, zone_id, floor_level,
                    battery_charge_pct, snow_depth_cleared_cm,
                    deck_area_cleared_sq_m, heated_chute_active,
                    auger_impeller_speed_rpm, operational_state,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                bot.id, bot.rover_code, bot.zone_id, bot.floor_level,
                bot.battery_charge_pct, bot.snow_depth_cleared_cm,
                bot.deck_area_cleared_sq_m,
                1 if bot.heated_chute_active else 0,
                bot.auger_impeller_speed_rpm, bot.operational_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return bot

SnowBlowerRepository.init_table()
