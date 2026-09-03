"""
SmartPark Rooftop Hydronic Snow Melt Glycol Circulation Pump Repository Layer
Manages 40% propylene glycol heat transfer loops, boiler heat exchanger thermal outputs (BTU/hr), and automated pavement de-icing.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class GlycolCirculationNode:
    def __init__(
        self,
        id: str = "",
        node_code: str = "GLYCOL-PUMP-ROOF-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Mechanical Penthouse",
        glycol_supply_temp_celsius: float = 48.5,
        glycol_return_temp_celsius: float = 38.0,
        circulation_flow_rate_gpm: float = 125.0,
        heat_transfer_rate_kbtu_hr: float = 650.0,
        glycol_concentration_pct: float = 40.0,
        snow_melt_system_state: str = "HYDRONIC_MELTING_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"gcn-{uuid.uuid4().hex[:8]}"
        self.node_code = node_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.glycol_supply_temp_celsius = glycol_supply_temp_celsius
        self.glycol_return_temp_celsius = glycol_return_temp_celsius
        self.circulation_flow_rate_gpm = circulation_flow_rate_gpm
        self.heat_transfer_rate_kbtu_hr = heat_transfer_rate_kbtu_hr
        self.glycol_concentration_pct = glycol_concentration_pct
        self.snow_melt_system_state = snow_melt_system_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "node_code": self.node_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "glycol_supply_temp_celsius": self.glycol_supply_temp_celsius,
            "glycol_return_temp_celsius": self.glycol_return_temp_celsius,
            "circulation_flow_rate_gpm": self.circulation_flow_rate_gpm,
            "heat_transfer_rate_kbtu_hr": self.heat_transfer_rate_kbtu_hr,
            "glycol_concentration_pct": self.glycol_concentration_pct,
            "snow_melt_system_state": self.snow_melt_system_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class GlycolCirculationRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS glycol_circulation_nodes (
                    id TEXT PRIMARY KEY,
                    node_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    glycol_supply_temp_celsius REAL DEFAULT 48.5,
                    glycol_return_temp_celsius REAL DEFAULT 38.0,
                    circulation_flow_rate_gpm REAL DEFAULT 125.0,
                    heat_transfer_rate_kbtu_hr REAL DEFAULT 650.0,
                    glycol_concentration_pct REAL DEFAULT 40.0,
                    snow_melt_system_state TEXT DEFAULT 'HYDRONIC_MELTING_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> GlycolCirculationNode:
        GlycolCirculationRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM glycol_circulation_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return GlycolCirculationNode(**dict(row))
            node = GlycolCirculationNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO glycol_circulation_nodes (
                    id, node_code, zone_id, floor_level,
                    glycol_supply_temp_celsius,
                    glycol_return_temp_celsius,
                    circulation_flow_rate_gpm,
                    heat_transfer_rate_kbtu_hr,
                    glycol_concentration_pct, snow_melt_system_state,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.node_code, node.zone_id, node.floor_level,
                node.glycol_supply_temp_celsius,
                node.glycol_return_temp_celsius,
                node.circulation_flow_rate_gpm,
                node.heat_transfer_rate_kbtu_hr,
                node.glycol_concentration_pct,
                node.snow_melt_system_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

GlycolCirculationRepository.init_table()
