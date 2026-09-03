"""
SmartPark Sub-Slab Soil Gas & Methane Passive Vent Stack Repository Layer
Manages perforated under-slab collection piping, lower explosive limit (LEL %) combustible gas sniffer sensors, and rooftop wind-driven aspirator vents.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SoilVentNode:
    def __init__(
        self,
        id: str = "",
        stack_code: str = "SOIL-VENT-STACK-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Atmospheric Vent Risers",
        methane_soil_gas_lel_pct: float = 0.4,  # OSHA Alarm Limit > 10.0% LEL (Lower Explosive Limit)
        passive_air_exhaust_flow_cfm: float = 85.0,
        sub_membrane_pressure_pa: float = -12.5,
        wind_driven_aspirator_rpm: int = 420,
        vent_stack_state: str = "PASSIVE_ASPIRATION_CLEAN",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"svn-{uuid.uuid4().hex[:8]}"
        self.stack_code = stack_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.methane_soil_gas_lel_pct = methane_soil_gas_lel_pct
        self.passive_air_exhaust_flow_cfm = passive_air_exhaust_flow_cfm
        self.sub_membrane_pressure_pa = sub_membrane_pressure_pa
        self.wind_driven_aspirator_rpm = wind_driven_aspirator_rpm
        self.vent_stack_state = vent_stack_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "stack_code": self.stack_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "methane_soil_gas_lel_pct": self.methane_soil_gas_lel_pct,
            "passive_air_exhaust_flow_cfm": self.passive_air_exhaust_flow_cfm,
            "sub_membrane_pressure_pa": self.sub_membrane_pressure_pa,
            "wind_driven_aspirator_rpm": self.wind_driven_aspirator_rpm,
            "vent_stack_state": self.vent_stack_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SoilVentRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS soil_vent_nodes (
                    id TEXT PRIMARY KEY,
                    stack_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    methane_soil_gas_lel_pct REAL DEFAULT 0.4,
                    passive_air_exhaust_flow_cfm REAL DEFAULT 85.0,
                    sub_membrane_pressure_pa REAL DEFAULT -12.5,
                    wind_driven_aspirator_rpm INTEGER DEFAULT 420,
                    vent_stack_state TEXT DEFAULT 'PASSIVE_ASPIRATION_CLEAN',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SoilVentNode:
        SoilVentRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM soil_vent_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SoilVentNode(**dict(row))
            node = SoilVentNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO soil_vent_nodes (
                    id, stack_code, zone_id, floor_level,
                    methane_soil_gas_lel_pct,
                    passive_air_exhaust_flow_cfm,
                    sub_membrane_pressure_pa,
                    wind_driven_aspirator_rpm, vent_stack_state,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.stack_code, node.zone_id, node.floor_level,
                node.methane_soil_gas_lel_pct,
                node.passive_air_exhaust_flow_cfm,
                node.sub_membrane_pressure_pa,
                node.wind_driven_aspirator_rpm,
                node.vent_stack_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SoilVentRepository.init_table()
