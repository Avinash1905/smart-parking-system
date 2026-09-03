"""
SmartPark Solar Photovoltaic & Microgrid Energy (DERMS) Repository Layer
Tracks parking deck rooftop solar generation (kW), Battery Storage (BESS kWh), and grid export tariffs.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class MicrogridTelemetry:
    def __init__(
        self,
        id: str = "",
        zone_id: str = "zone-pub-01",
        zone_name: str = "Municipal Central Parking",
        solar_generation_kw: float = 145.2,
        bess_storage_kwh: float = 380.0,
        bess_state_of_charge_pct: float = 84.5,
        grid_export_power_kw: float = 42.0,
        carbon_avoided_kg_today: float = 214.8,
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"grid-{uuid.uuid4().hex[:8]}"
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.solar_generation_kw = solar_generation_kw
        self.bess_storage_kwh = bess_storage_kwh
        self.bess_state_of_charge_pct = bess_state_of_charge_pct
        self.grid_export_power_kw = grid_export_power_kw
        self.carbon_avoided_kg_today = carbon_avoided_kg_today
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "zone_id": self.zone_id,
            "zone_name": self.zone_name,
            "solar_generation_kw": self.solar_generation_kw,
            "bess_storage_kwh": self.bess_storage_kwh,
            "bess_state_of_charge_pct": self.bess_state_of_charge_pct,
            "grid_export_power_kw": self.grid_export_power_kw,
            "carbon_avoided_kg_today": self.carbon_avoided_kg_today,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class MicrogridRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS microgrid_telemetry (
                    id TEXT PRIMARY KEY,
                    zone_id TEXT NOT NULL,
                    zone_name TEXT NOT NULL,
                    solar_generation_kw REAL DEFAULT 145.2,
                    bess_storage_kwh REAL DEFAULT 380.0,
                    bess_state_of_charge_pct REAL DEFAULT 84.5,
                    grid_export_power_kw REAL DEFAULT 42.0,
                    carbon_avoided_kg_today REAL DEFAULT 214.8,
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> MicrogridTelemetry:
        MicrogridRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM microgrid_telemetry WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return MicrogridTelemetry(**dict(row))
            t = MicrogridTelemetry(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO microgrid_telemetry (id, zone_id, zone_name, solar_generation_kw, bess_storage_kwh, bess_state_of_charge_pct, grid_export_power_kw, carbon_avoided_kg_today, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (t.id, t.zone_id, t.zone_name, t.solar_generation_kw, t.bess_storage_kwh, t.bess_state_of_charge_pct, t.grid_export_power_kw, t.carbon_avoided_kg_today, datetime.utcnow().isoformat()))
            conn.commit()
            return t

MicrogridRepository.init_table()
