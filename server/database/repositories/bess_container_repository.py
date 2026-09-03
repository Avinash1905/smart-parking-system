"""
SmartPark Battery Energy Storage System (BESS) Mega-Pack Repository Layer
Manages 2.0 MWh utility-scale LiFePO4 battery containers, State of Charge (SoC%), and peak-shaving microgrid arbitrage.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BESSContainerNode:
    def __init__(
        self,
        id: str = "",
        container_code: str = "BESS-MEGAPACK-2MW-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation Yard",
        total_capacity_kwh: float = 2000.0,
        current_stored_energy_kwh: float = 1760.0,
        state_of_charge_pct: float = 88.0,
        battery_cell_temp_celsius: float = 23.4,
        discharge_power_kw: float = 350.0,
        state_of_health_pct: float = 99.4,
        operating_mode: str = "PEAK_SHAVING_DISCHARGE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"bes-{uuid.uuid4().hex[:8]}"
        self.container_code = container_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.total_capacity_kwh = total_capacity_kwh
        self.current_stored_energy_kwh = current_stored_energy_kwh
        self.state_of_charge_pct = state_of_charge_pct
        self.battery_cell_temp_celsius = battery_cell_temp_celsius
        self.discharge_power_kw = discharge_power_kw
        self.state_of_health_pct = state_of_health_pct
        self.operating_mode = operating_mode
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "container_code": self.container_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "total_capacity_kwh": self.total_capacity_kwh,
            "current_stored_energy_kwh": self.current_stored_energy_kwh,
            "state_of_charge_pct": self.state_of_charge_pct,
            "battery_cell_temp_celsius": self.battery_cell_temp_celsius,
            "discharge_power_kw": self.discharge_power_kw,
            "state_of_health_pct": self.state_of_health_pct,
            "operating_mode": self.operating_mode,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BESSContainerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS bess_container_nodes (
                    id TEXT PRIMARY KEY,
                    container_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    total_capacity_kwh REAL DEFAULT 2000.0,
                    current_stored_energy_kwh REAL DEFAULT 1760.0,
                    state_of_charge_pct REAL DEFAULT 88.0,
                    battery_cell_temp_celsius REAL DEFAULT 23.4,
                    discharge_power_kw REAL DEFAULT 350.0,
                    state_of_health_pct REAL DEFAULT 99.4,
                    operating_mode TEXT DEFAULT 'PEAK_SHAVING_DISCHARGE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> BESSContainerNode:
        BESSContainerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM bess_container_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return BESSContainerNode(**dict(row))
            node = BESSContainerNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO bess_container_nodes (
                    id, container_code, zone_id, floor_level,
                    total_capacity_kwh, current_stored_energy_kwh,
                    state_of_charge_pct, battery_cell_temp_celsius,
                    discharge_power_kw, state_of_health_pct,
                    operating_mode, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.container_code, node.zone_id,
                node.floor_level, node.total_capacity_kwh,
                node.current_stored_energy_kwh,
                node.state_of_charge_pct,
                node.battery_cell_temp_celsius,
                node.discharge_power_kw, node.state_of_health_pct,
                node.operating_mode, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

BESSContainerRepository.init_table()
