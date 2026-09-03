"""
SmartPark EV Fast-Charger Cable Liquid Chiller & Coolant Repository Layer
Manages 500-amp CCS2 liquid-cooled charging cables, propylene glycol coolant temperatures (°C), and pump flow rates (L/min).
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CableChillerUnit:
    def __init__(
        self,
        id: str = "",
        chiller_code: str = "CHILLER-EV-500A-01",
        slot_code: str = "A-03",
        zone_id: str = "zone-pub-01",
        coolant_temp_celsius: float = 18.5,
        target_coolant_temp_celsius: float = 20.0,
        flow_rate_liters_min: float = 4.2,
        pump_pressure_bar: float = 2.4,
        coolant_fluid_level_pct: float = 95.0,
        chiller_status: str = "ACTIVE_CHILLING_NOMINAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"chl-{uuid.uuid4().hex[:8]}"
        self.chiller_code = chiller_code
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.coolant_temp_celsius = coolant_temp_celsius
        self.target_coolant_temp_celsius = target_coolant_temp_celsius
        self.flow_rate_liters_min = flow_rate_liters_min
        self.pump_pressure_bar = pump_pressure_bar
        self.coolant_fluid_level_pct = coolant_fluid_level_pct
        self.chiller_status = chiller_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "chiller_code": self.chiller_code,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "coolant_temp_celsius": self.coolant_temp_celsius,
            "target_coolant_temp_celsius": self.target_coolant_temp_celsius,
            "flow_rate_liters_min": self.flow_rate_liters_min,
            "pump_pressure_bar": self.pump_pressure_bar,
            "coolant_fluid_level_pct": self.coolant_fluid_level_pct,
            "chiller_status": self.chiller_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CableChillerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cable_chiller_units (
                    id TEXT PRIMARY KEY,
                    chiller_code TEXT UNIQUE NOT NULL,
                    slot_code TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    coolant_temp_celsius REAL DEFAULT 18.5,
                    target_coolant_temp_celsius REAL DEFAULT 20.0,
                    flow_rate_liters_min REAL DEFAULT 4.2,
                    pump_pressure_bar REAL DEFAULT 2.4,
                    coolant_fluid_level_pct REAL DEFAULT 95.0,
                    chiller_status TEXT DEFAULT 'ACTIVE_CHILLING_NOMINAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> CableChillerUnit:
        CableChillerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cable_chiller_units WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return CableChillerUnit(**dict(row))
            unit = CableChillerUnit(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO cable_chiller_units (
                    id, chiller_code, slot_code, zone_id,
                    coolant_temp_celsius, target_coolant_temp_celsius,
                    flow_rate_liters_min, pump_pressure_bar,
                    coolant_fluid_level_pct, chiller_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                unit.id, unit.chiller_code, unit.slot_code, unit.zone_id,
                unit.coolant_temp_celsius, unit.target_coolant_temp_celsius,
                unit.flow_rate_liters_min, unit.pump_pressure_bar,
                unit.coolant_fluid_level_pct, unit.chiller_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return unit

CableChillerRepository.init_table()
