"""
SmartPark Underground Waste Compactor & Bin Fill-Level Repository Layer
Manages hydraulic smart trash compactors, ultrasonic fill-level sensors (%), and municipal collection dispatch routes.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class WasteCompactorUnit:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "WASTE-COMPACT-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 (Service Bay)",
        bin_fill_level_pct: float = 38.4,
        hydraulic_pressure_psi: float = 1850.0,
        total_compaction_cycles: int = 1420,
        odor_neutralizer_spray_active: bool = True,
        status: str = "COMPACTOR_READY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"wst-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.bin_fill_level_pct = bin_fill_level_pct
        self.hydraulic_pressure_psi = hydraulic_pressure_psi
        self.total_compaction_cycles = total_compaction_cycles
        self.odor_neutralizer_spray_active = odor_neutralizer_spray_active
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "bin_fill_level_pct": self.bin_fill_level_pct,
            "hydraulic_pressure_psi": self.hydraulic_pressure_psi,
            "total_compaction_cycles": self.total_compaction_cycles,
            "odor_neutralizer_spray_active": self.odor_neutralizer_spray_active,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class WasteCompactorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS waste_compactor_units (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    bin_fill_level_pct REAL DEFAULT 38.4,
                    hydraulic_pressure_psi REAL DEFAULT 1850.0,
                    total_compaction_cycles INTEGER DEFAULT 1420,
                    odor_neutralizer_spray_active INTEGER DEFAULT 1,
                    status TEXT DEFAULT 'COMPACTOR_READY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> WasteCompactorUnit:
        WasteCompactorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM waste_compactor_units WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["odor_neutralizer_spray_active"] = bool(d["odor_neutralizer_spray_active"])
                return WasteCompactorUnit(**d)
            unit = WasteCompactorUnit(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO waste_compactor_units (
                    id, unit_code, zone_id, floor_level,
                    bin_fill_level_pct, hydraulic_pressure_psi,
                    total_compaction_cycles, odor_neutralizer_spray_active,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                unit.id, unit.unit_code, unit.zone_id, unit.floor_level,
                unit.bin_fill_level_pct, unit.hydraulic_pressure_psi,
                unit.total_compaction_cycles,
                1 if unit.odor_neutralizer_spray_active else 0,
                unit.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return unit

WasteCompactorRepository.init_table()
