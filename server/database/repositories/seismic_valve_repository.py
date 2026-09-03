"""
SmartPark Earthquake Seismic Natural Gas Automatic Shutoff Valve (ASME A112.18.1) Repository Layer
Manages 0.5g ground acceleration seismic trip triggers, magnetic latch solenoid safety valves, and gas explosion prevention.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SeismicGasValveNode:
    def __init__(
        self,
        id: str = "",
        valve_code: str = "SEISMIC-GAS-VALVE-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Main Utility Gas Manifold",
        ground_acceleration_g: float = 0.02,
        seismic_trip_threshold_g: float = 0.50,  # ASME A112.18.1 trip at 0.5g
        gas_line_pressure_psi: float = 45.0,
        solenoid_valve_state: str = "OPEN_FLOW_NORMAL",  # OPEN_FLOW_NORMAL | SEISMIC_TRIPPED_SHUTOFF | MANUAL_LOCKOUT
        asme_compliance_tier: str = "ASME_A112_18_1_CERTIFIED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"sgv-{uuid.uuid4().hex[:8]}"
        self.valve_code = valve_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.ground_acceleration_g = ground_acceleration_g
        self.seismic_trip_threshold_g = seismic_trip_threshold_g
        self.gas_line_pressure_psi = gas_line_pressure_psi
        self.solenoid_valve_state = solenoid_valve_state
        self.asme_compliance_tier = asme_compliance_tier
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "valve_code": self.valve_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "ground_acceleration_g": self.ground_acceleration_g,
            "seismic_trip_threshold_g": self.seismic_trip_threshold_g,
            "gas_line_pressure_psi": self.gas_line_pressure_psi,
            "solenoid_valve_state": self.solenoid_valve_state,
            "asme_compliance_tier": self.asme_compliance_tier,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SeismicValveRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS seismic_gas_valve_nodes (
                    id TEXT PRIMARY KEY,
                    valve_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    ground_acceleration_g REAL DEFAULT 0.02,
                    seismic_trip_threshold_g REAL DEFAULT 0.50,
                    gas_line_pressure_psi REAL DEFAULT 45.0,
                    solenoid_valve_state TEXT DEFAULT 'OPEN_FLOW_NORMAL',
                    asme_compliance_tier TEXT DEFAULT 'ASME_A112_18_1_CERTIFIED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SeismicGasValveNode:
        SeismicValveRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM seismic_gas_valve_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SeismicGasValveNode(**dict(row))
            node = SeismicGasValveNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO seismic_gas_valve_nodes (
                    id, valve_code, zone_id, floor_level,
                    ground_acceleration_g, seismic_trip_threshold_g,
                    gas_line_pressure_psi, solenoid_valve_state,
                    asme_compliance_tier, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.valve_code, node.zone_id, node.floor_level,
                node.ground_acceleration_g,
                node.seismic_trip_threshold_g,
                node.gas_line_pressure_psi, node.solenoid_valve_state,
                node.asme_compliance_tier, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SeismicValveRepository.init_table()
