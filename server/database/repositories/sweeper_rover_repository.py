"""
SmartPark Autonomous Floor Scrubber & Debris Sweeper Rover Repository Layer
Manages SLAM LiDAR robotic sweepers, cylindrical scrub brushes, water reclamation tanks, and scheduled aisle sanitation routes.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SweeperRoverBot:
    def __init__(
        self,
        id: str = "",
        rover_code: str = "SWEEPER-BOT-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Main Drive Aisles",
        battery_charge_pct: int = 91,
        square_meters_cleaned_today: float = 4850.0,
        debris_hopper_fill_pct: float = 34.0,
        fresh_scrub_water_liters: float = 85.0,
        cleaning_status: str = "AUTONOMOUS_SCRUBBING_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"swb-{uuid.uuid4().hex[:8]}"
        self.rover_code = rover_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.battery_charge_pct = battery_charge_pct
        self.square_meters_cleaned_today = square_meters_cleaned_today
        self.debris_hopper_fill_pct = debris_hopper_fill_pct
        self.fresh_scrub_water_liters = fresh_scrub_water_liters
        self.cleaning_status = cleaning_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "rover_code": self.rover_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "battery_charge_pct": self.battery_charge_pct,
            "square_meters_cleaned_today": self.square_meters_cleaned_today,
            "debris_hopper_fill_pct": self.debris_hopper_fill_pct,
            "fresh_scrub_water_liters": self.fresh_scrub_water_liters,
            "cleaning_status": self.cleaning_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SweeperRoverRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sweeper_rover_bots (
                    id TEXT PRIMARY KEY,
                    rover_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    battery_charge_pct INTEGER DEFAULT 91,
                    square_meters_cleaned_today REAL DEFAULT 4850.0,
                    debris_hopper_fill_pct REAL DEFAULT 34.0,
                    fresh_scrub_water_liters REAL DEFAULT 85.0,
                    cleaning_status TEXT DEFAULT 'AUTONOMOUS_SCRUBBING_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SweeperRoverBot:
        SweeperRoverRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sweeper_rover_bots WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SweeperRoverBot(**dict(row))
            bot = SweeperRoverBot(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO sweeper_rover_bots (
                    id, rover_code, zone_id, floor_level,
                    battery_charge_pct, square_meters_cleaned_today,
                    debris_hopper_fill_pct, fresh_scrub_water_liters,
                    cleaning_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                bot.id, bot.rover_code, bot.zone_id, bot.floor_level,
                bot.battery_charge_pct,
                bot.square_meters_cleaned_today,
                bot.debris_hopper_fill_pct,
                bot.fresh_scrub_water_liters, bot.cleaning_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return bot

SweeperRoverRepository.init_table()
