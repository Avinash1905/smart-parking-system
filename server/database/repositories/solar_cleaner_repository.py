"""
SmartPark Rooftop Solar PV Panel Robotic Cleaning Sweeper Repository Layer
Manages autonomous crawler robots, microfiber waterless roller brushes, and solar generation efficiency gain metrics.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SolarCleanerBot:
    def __init__(
        self,
        id: str = "",
        bot_code: str = "SOLAR-CLEAN-BOT-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Solar Array",
        battery_charge_pct: int = 94,
        panels_cleaned_today_count: int = 128,
        efficiency_gain_recovered_pct: float = 14.8,
        brush_wear_status: str = "OPTIMAL_BRUSH_LIFE",
        cleaning_mode: str = "WATERLESS_MICROFIBER_ROTARY",
        operational_state: str = "DOCKED_CHARGING_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"scb-{uuid.uuid4().hex[:8]}"
        self.bot_code = bot_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.battery_charge_pct = battery_charge_pct
        self.panels_cleaned_today_count = panels_cleaned_today_count
        self.efficiency_gain_recovered_pct = efficiency_gain_recovered_pct
        self.brush_wear_status = brush_wear_status
        self.cleaning_mode = cleaning_mode
        self.operational_state = operational_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "bot_code": self.bot_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "battery_charge_pct": self.battery_charge_pct,
            "panels_cleaned_today_count": self.panels_cleaned_today_count,
            "efficiency_gain_recovered_pct": self.efficiency_gain_recovered_pct,
            "brush_wear_status": self.brush_wear_status,
            "cleaning_mode": self.cleaning_mode,
            "operational_state": self.operational_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SolarCleanerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS solar_cleaner_bots (
                    id TEXT PRIMARY KEY,
                    bot_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    battery_charge_pct INTEGER DEFAULT 94,
                    panels_cleaned_today_count INTEGER DEFAULT 128,
                    efficiency_gain_recovered_pct REAL DEFAULT 14.8,
                    brush_wear_status TEXT DEFAULT 'OPTIMAL_BRUSH_LIFE',
                    cleaning_mode TEXT DEFAULT 'WATERLESS_MICROFIBER_ROTARY',
                    operational_state TEXT DEFAULT 'DOCKED_CHARGING_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SolarCleanerBot:
        SolarCleanerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM solar_cleaner_bots WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SolarCleanerBot(**dict(row))
            bot = SolarCleanerBot(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO solar_cleaner_bots (
                    id, bot_code, zone_id, floor_level,
                    battery_charge_pct, panels_cleaned_today_count,
                    efficiency_gain_recovered_pct, brush_wear_status,
                    cleaning_mode, operational_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                bot.id, bot.bot_code, bot.zone_id, bot.floor_level,
                bot.battery_charge_pct,
                bot.panels_cleaned_today_count,
                bot.efficiency_gain_recovered_pct,
                bot.brush_wear_status, bot.cleaning_mode,
                bot.operational_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return bot

SolarCleanerRepository.init_table()
