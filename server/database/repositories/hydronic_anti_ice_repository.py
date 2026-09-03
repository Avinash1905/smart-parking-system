"""
SmartPark In-Slab Hydronic Glycol De-Icing & Snow Melting Repository Layer
Manages embedded PEX-a hydronic tubing loops, 40% propylene glycol heat transfer fluid, slab surface thermal sensors (4.5°C), and automated circulation pumps.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class HydronicAntiIceNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "HYDRONIC-DEICE-LOOP-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Exposed Ingress Ramp Spiral",
        glycol_concentration_pct: float = 40.0,    # Freezing protection down to -40.0°C
        measured_slab_surface_temp_celsius: float = 4.5,  # Anti-ice target > 2.0°C
        supply_fluid_temp_celsius: float = 38.5,
        circulation_flow_rate_gpm: float = 45.0,
        hydronic_system_state: str = "ANTI_ICE_CIRCULATION_ARMED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"hai-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.glycol_concentration_pct = glycol_concentration_pct
        self.measured_slab_surface_temp_celsius = measured_slab_surface_temp_celsius
        self.supply_fluid_temp_celsius = supply_fluid_temp_celsius
        self.circulation_flow_rate_gpm = circulation_flow_rate_gpm
        self.hydronic_system_state = hydronic_system_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "glycol_concentration_pct": self.glycol_concentration_pct,
            "measured_slab_surface_temp_celsius": self.measured_slab_surface_temp_celsius,
            "supply_fluid_temp_celsius": self.supply_fluid_temp_celsius,
            "circulation_flow_rate_gpm": self.circulation_flow_rate_gpm,
            "hydronic_system_state": self.hydronic_system_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class HydronicAntiIceRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS hydronic_anti_ice_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    glycol_concentration_pct REAL DEFAULT 40.0,
                    measured_slab_surface_temp_celsius REAL DEFAULT 4.5,
                    supply_fluid_temp_celsius REAL DEFAULT 38.5,
                    circulation_flow_rate_gpm REAL DEFAULT 45.0,
                    hydronic_system_state TEXT DEFAULT 'ANTI_ICE_CIRCULATION_ARMED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> HydronicAntiIceNode:
        HydronicAntiIceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM hydronic_anti_ice_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return HydronicAntiIceNode(**dict(row))
            node = HydronicAntiIceNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO hydronic_anti_ice_nodes (
                    id, unit_code, zone_id, floor_level,
                    glycol_concentration_pct,
                    measured_slab_surface_temp_celsius,
                    supply_fluid_temp_celsius,
                    circulation_flow_rate_gpm,
                    hydronic_system_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.glycol_concentration_pct,
                node.measured_slab_surface_temp_celsius,
                node.supply_fluid_temp_celsius,
                node.circulation_flow_rate_gpm,
                node.hydronic_system_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

HydronicAntiIceRepository.init_table()
