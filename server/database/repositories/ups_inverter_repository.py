"""
SmartPark Uninterruptible Power Supply (UPS) & Barrier Inverter Repository Layer
Monitors AC mains power status, pure sine-wave inverter loads, battery backup hours, and generator switchover.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class UPSInverterNode:
    def __init__(
        self,
        id: str = "",
        ups_code: str = "UPS-GATE-GRID-01",
        zone_id: str = "zone-pub-01",
        ac_mains_voltage_volts: float = 232.4,
        inverter_load_pct: float = 34.2,
        battery_runtime_remaining_hours: float = 8.5,
        battery_health_pct: float = 98.4,
        generator_auto_start_ready: bool = True,
        grid_power_status: str = "MAINS_NORMAL",  # MAINS_NORMAL | ON_BATTERY_BACKUP | DIESEL_GEN_ACTIVE
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ups-{uuid.uuid4().hex[:8]}"
        self.ups_code = ups_code
        self.zone_id = zone_id
        self.ac_mains_voltage_volts = ac_mains_voltage_volts
        self.inverter_load_pct = inverter_load_pct
        self.battery_runtime_remaining_hours = battery_runtime_remaining_hours
        self.battery_health_pct = battery_health_pct
        self.generator_auto_start_ready = generator_auto_start_ready
        self.grid_power_status = grid_power_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "ups_code": self.ups_code,
            "zone_id": self.zone_id,
            "ac_mains_voltage_volts": self.ac_mains_voltage_volts,
            "inverter_load_pct": self.inverter_load_pct,
            "battery_runtime_remaining_hours": self.battery_runtime_remaining_hours,
            "battery_health_pct": self.battery_health_pct,
            "generator_auto_start_ready": self.generator_auto_start_ready,
            "grid_power_status": self.grid_power_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class UPSInverterRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ups_inverter_nodes (
                    id TEXT PRIMARY KEY,
                    ups_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    ac_mains_voltage_volts REAL DEFAULT 232.4,
                    inverter_load_pct REAL DEFAULT 34.2,
                    battery_runtime_remaining_hours REAL DEFAULT 8.5,
                    battery_health_pct REAL DEFAULT 98.4,
                    generator_auto_start_ready INTEGER DEFAULT 1,
                    grid_power_status TEXT DEFAULT 'MAINS_NORMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> UPSInverterNode:
        UPSInverterRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ups_inverter_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["generator_auto_start_ready"] = bool(d["generator_auto_start_ready"])
                return UPSInverterNode(**d)
            node = UPSInverterNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO ups_inverter_nodes (
                    id, ups_code, zone_id, ac_mains_voltage_volts,
                    inverter_load_pct, battery_runtime_remaining_hours,
                    battery_health_pct, generator_auto_start_ready,
                    grid_power_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.ups_code, node.zone_id,
                node.ac_mains_voltage_volts, node.inverter_load_pct,
                node.battery_runtime_remaining_hours,
                node.battery_health_pct, 1 if node.generator_auto_start_ready else 0,
                node.grid_power_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

UPSInverterRepository.init_table()
