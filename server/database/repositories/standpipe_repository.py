"""
SmartPark Fire Department Standpipe Water Pressure (NFPA 14) Repository Layer
Manages Class I wet standpipe water pressure transducers (PSI), fire department connection (FDC) flow rates, and hydrant booster pump telemetry.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class StandpipePressureNode:
    def __init__(
        self,
        id: str = "",
        standpipe_code: str = "STANDPIPE-RISER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Top Hose Outlet",
        residual_pressure_psi: float = 112.5,  # NFPA 14 minimum residual pressure >= 100 PSI
        static_pressure_psi: float = 145.0,
        flow_capacity_gpm: float = 500.0,
        jockey_pump_status: str = "PRESSURE_MAINTAINED_NORMAL",
        nfpa_14_compliance: str = "CERTIFIED_PRESSURE_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"stp-{uuid.uuid4().hex[:8]}"
        self.standpipe_code = standpipe_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.residual_pressure_psi = residual_pressure_psi
        self.static_pressure_psi = static_pressure_psi
        self.flow_capacity_gpm = flow_capacity_gpm
        self.jockey_pump_status = jockey_pump_status
        self.nfpa_14_compliance = nfpa_14_compliance
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "standpipe_code": self.standpipe_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "residual_pressure_psi": self.residual_pressure_psi,
            "static_pressure_psi": self.static_pressure_psi,
            "flow_capacity_gpm": self.flow_capacity_gpm,
            "jockey_pump_status": self.jockey_pump_status,
            "nfpa_14_compliance": self.nfpa_14_compliance,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class StandpipeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS standpipe_pressure_nodes (
                    id TEXT PRIMARY KEY,
                    standpipe_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    residual_pressure_psi REAL DEFAULT 112.5,
                    static_pressure_psi REAL DEFAULT 145.0,
                    flow_capacity_gpm REAL DEFAULT 500.0,
                    jockey_pump_status TEXT DEFAULT 'PRESSURE_MAINTAINED_NORMAL',
                    nfpa_14_compliance TEXT DEFAULT 'CERTIFIED_PRESSURE_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> StandpipePressureNode:
        StandpipeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM standpipe_pressure_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return StandpipePressureNode(**dict(row))
            node = StandpipePressureNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO standpipe_pressure_nodes (
                    id, standpipe_code, zone_id, floor_level,
                    residual_pressure_psi, static_pressure_psi,
                    flow_capacity_gpm, jockey_pump_status,
                    nfpa_14_compliance, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.standpipe_code, node.zone_id, node.floor_level,
                node.residual_pressure_psi, node.static_pressure_psi,
                node.flow_capacity_gpm, node.jockey_pump_status,
                node.nfpa_14_compliance, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

StandpipeRepository.init_table()
