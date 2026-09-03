"""
SmartPark Concrete Chloride Ion Diffusion & De-Icing Salt Ingress Repository Layer
Manages embedded multi-ring electrical resistivity probes, chloride ion diffusion front profiling, and rebar corrosion risk assessment.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ChlorideDiffusionNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "CHLORIDE-ION-SENSOR-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Ground Level Ingress Ramp Slabs",
        measured_chloride_pct_wt_cement: float = 0.08,  # Critical threshold < 0.20%
        apparent_diffusion_coefficient_m2s: float = 2.4e-12,
        concrete_electrical_resistivity_kohm_cm: float = 42.5,
        chloride_ingress_risk_state: str = "PASSIVE_REBAR_PROTECTED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"cdn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_chloride_pct_wt_cement = measured_chloride_pct_wt_cement
        self.apparent_diffusion_coefficient_m2s = apparent_diffusion_coefficient_m2s
        self.concrete_electrical_resistivity_kohm_cm = concrete_electrical_resistivity_kohm_cm
        self.chloride_ingress_risk_state = chloride_ingress_risk_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_chloride_pct_wt_cement": self.measured_chloride_pct_wt_cement,
            "apparent_diffusion_coefficient_m2s": self.apparent_diffusion_coefficient_m2s,
            "concrete_electrical_resistivity_kohm_cm": self.concrete_electrical_resistivity_kohm_cm,
            "chloride_ingress_risk_state": self.chloride_ingress_risk_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ChlorideDiffusionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chloride_diffusion_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_chloride_pct_wt_cement REAL DEFAULT 0.08,
                    apparent_diffusion_coefficient_m2s REAL DEFAULT 2.4e-12,
                    concrete_electrical_resistivity_kohm_cm REAL DEFAULT 42.5,
                    chloride_ingress_risk_state TEXT DEFAULT 'PASSIVE_REBAR_PROTECTED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ChlorideDiffusionNode:
        ChlorideDiffusionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM chloride_diffusion_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return ChlorideDiffusionNode(**dict(row))
            node = ChlorideDiffusionNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO chloride_diffusion_nodes (
                    id, sensor_code, zone_id, floor_level,
                    measured_chloride_pct_wt_cement,
                    apparent_diffusion_coefficient_m2s,
                    concrete_electrical_resistivity_kohm_cm,
                    chloride_ingress_risk_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.measured_chloride_pct_wt_cement,
                node.apparent_diffusion_coefficient_m2s,
                node.concrete_electrical_resistivity_kohm_cm,
                node.chloride_ingress_risk_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ChlorideDiffusionRepository.init_table()
