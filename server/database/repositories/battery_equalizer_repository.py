"""
SmartPark Substation 125VDC Station Battery Bank Active Cell Equalizer Repository Layer
Manages active inductive cell voltage balancing, internal cell resistance (mΩ), and blackout substation control power reliability.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BatteryEqualizerNode:
    def __init__(
        self,
        id: str = "",
        bank_code: str = "BATTERY-BANK-125VDC-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation DC Power Room",
        bank_total_voltage_vdc: float = 127.4,
        max_cell_voltage_delta_mv: float = 8.5,  # Balanced if < 20.0 mV
        average_internal_resistance_mohms: float = 1.42,
        active_balancing_current_amps: float = 2.0,
        battery_chemistry: str = "VRLA_AGM_STATION_CELLS",
        equalization_status: str = "ACTIVE_EQUALIZATION_BALANCED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ben-{uuid.uuid4().hex[:8]}"
        self.bank_code = bank_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.bank_total_voltage_vdc = bank_total_voltage_vdc
        self.max_cell_voltage_delta_mv = max_cell_voltage_delta_mv
        self.average_internal_resistance_mohms = average_internal_resistance_mohms
        self.active_balancing_current_amps = active_balancing_current_amps
        self.battery_chemistry = battery_chemistry
        self.equalization_status = equalization_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "bank_code": self.bank_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "bank_total_voltage_vdc": self.bank_total_voltage_vdc,
            "max_cell_voltage_delta_mv": self.max_cell_voltage_delta_mv,
            "average_internal_resistance_mohms": self.average_internal_resistance_mohms,
            "active_balancing_current_amps": self.active_balancing_current_amps,
            "battery_chemistry": self.battery_chemistry,
            "equalization_status": self.equalization_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BatteryEqualizerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS battery_equalizer_nodes (
                    id TEXT PRIMARY KEY,
                    bank_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    bank_total_voltage_vdc REAL DEFAULT 127.4,
                    max_cell_voltage_delta_mv REAL DEFAULT 8.5,
                    average_internal_resistance_mohms REAL DEFAULT 1.42,
                    active_balancing_current_amps REAL DEFAULT 2.0,
                    battery_chemistry TEXT DEFAULT 'VRLA_AGM_STATION_CELLS',
                    equalization_status TEXT DEFAULT 'ACTIVE_EQUALIZATION_BALANCED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> BatteryEqualizerNode:
        BatteryEqualizerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM battery_equalizer_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return BatteryEqualizerNode(**dict(row))
            node = BatteryEqualizerNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO battery_equalizer_nodes (
                    id, bank_code, zone_id, floor_level,
                    bank_total_voltage_vdc, max_cell_voltage_delta_mv,
                    average_internal_resistance_mohms,
                    active_balancing_current_amps, battery_chemistry,
                    equalization_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.bank_code, node.zone_id, node.floor_level,
                node.bank_total_voltage_vdc,
                node.max_cell_voltage_delta_mv,
                node.average_internal_resistance_mohms,
                node.active_balancing_current_amps,
                node.battery_chemistry, node.equalization_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

BatteryEqualizerRepository.init_table()
