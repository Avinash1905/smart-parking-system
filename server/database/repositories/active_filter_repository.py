"""
SmartPark Active Harmonic Filter (AHF) & Static VAR Compensator Repository Layer
Manages 3-phase IGBT active power filters, total harmonic distortion (THD-i) cancellation, dynamic power factor correction (0.99 PF), and EV charger load smoothing.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ActiveFilterNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "AHF-POWER-FILTER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation Electrical LV Switchboard",
        measured_thd_current_pct: float = 2.8,   # Allowable THD-i < 5.0% IEEE 519
        grid_power_factor: float = 0.99,         # Optimal PF > 0.95
        filter_compensation_current_a: float = 185.0,
        igbt_inverter_status: str = "ACTIVE_HARMONIC_CANCELLATION_ARMED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"afn-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_thd_current_pct = measured_thd_current_pct
        self.grid_power_factor = grid_power_factor
        self.filter_compensation_current_a = filter_compensation_current_a
        self.igbt_inverter_status = igbt_inverter_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_thd_current_pct": self.measured_thd_current_pct,
            "grid_power_factor": self.grid_power_factor,
            "filter_compensation_current_a": self.filter_compensation_current_a,
            "igbt_inverter_status": self.igbt_inverter_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ActiveFilterRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS active_filter_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_thd_current_pct REAL DEFAULT 2.8,
                    grid_power_factor REAL DEFAULT 0.99,
                    filter_compensation_current_a REAL DEFAULT 185.0,
                    igbt_inverter_status TEXT DEFAULT 'ACTIVE_HARMONIC_CANCELLATION_ARMED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ActiveFilterNode:
        ActiveFilterRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM active_filter_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return ActiveFilterNode(**dict(row))
            node = ActiveFilterNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO active_filter_nodes (
                    id, unit_code, zone_id, floor_level,
                    measured_thd_current_pct, grid_power_factor,
                    filter_compensation_current_a,
                    igbt_inverter_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.measured_thd_current_pct, node.grid_power_factor,
                node.filter_compensation_current_a,
                node.igbt_inverter_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ActiveFilterRepository.init_table()
