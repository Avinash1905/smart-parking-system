"""
SmartPark Sump Pit Dual-Duplex Wastewater Pump Controller Repository Layer
Manages lead-lag alternating submersible stormwater pumps, high-water float switch alarms, and motor winding telemetry.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SumpDuplexPit:
    def __init__(
        self,
        id: str = "",
        pit_code: str = "SUMP-PIT-B2-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B2",
        pump_1_status: str = "STANDBY_READY",  # RUNNING_LEAD | RUNNING_LAG | STANDBY_READY | FAULT_OVERLOAD
        pump_2_status: str = "STANDBY_READY",
        lead_pump_assigned: str = "PUMP_1",
        water_level_centimeters: float = 24.5,
        high_level_alarm_active: bool = False,
        flow_rate_liters_minute: float = 0.0,
        status: str = "PUMP_STATION_NORMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"smp-{uuid.uuid4().hex[:8]}"
        self.pit_code = pit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.pump_1_status = pump_1_status
        self.pump_2_status = pump_2_status
        self.lead_pump_assigned = lead_pump_assigned
        self.water_level_centimeters = water_level_centimeters
        self.high_level_alarm_active = high_level_alarm_active
        self.flow_rate_liters_minute = flow_rate_liters_minute
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "pit_code": self.pit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "pump_1_status": self.pump_1_status,
            "pump_2_status": self.pump_2_status,
            "lead_pump_assigned": self.lead_pump_assigned,
            "water_level_centimeters": self.water_level_centimeters,
            "high_level_alarm_active": self.high_level_alarm_active,
            "flow_rate_liters_minute": self.flow_rate_liters_minute,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SumpDuplexRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sump_duplex_pits (
                    id TEXT PRIMARY KEY,
                    pit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    pump_1_status TEXT DEFAULT 'STANDBY_READY',
                    pump_2_status TEXT DEFAULT 'STANDBY_READY',
                    lead_pump_assigned TEXT DEFAULT 'PUMP_1',
                    water_level_centimeters REAL DEFAULT 24.5,
                    high_level_alarm_active INTEGER DEFAULT 0,
                    flow_rate_liters_minute REAL DEFAULT 0.0,
                    status TEXT DEFAULT 'PUMP_STATION_NORMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SumpDuplexPit:
        SumpDuplexRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sump_duplex_pits WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["high_level_alarm_active"] = bool(d["high_level_alarm_active"])
                return SumpDuplexPit(**d)
            pit = SumpDuplexPit(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO sump_duplex_pits (
                    id, pit_code, zone_id, floor_level,
                    pump_1_status, pump_2_status, lead_pump_assigned,
                    water_level_centimeters, high_level_alarm_active,
                    flow_rate_liters_minute, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                pit.id, pit.pit_code, pit.zone_id, pit.floor_level,
                pit.pump_1_status, pit.pump_2_status,
                pit.lead_pump_assigned, pit.water_level_centimeters,
                1 if pit.high_level_alarm_active else 0,
                pit.flow_rate_liters_minute, pit.status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return pit

SumpDuplexRepository.init_table()
