"""
SmartPark Automatic Hydraulic Flood Barrier Gate Repository Layer
Manages in-ground rising steel flood barriers, street storm water level ultrasonic sensors, and rapid waterproof perimeter sealing.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FloodBarrierGateNode:
    def __init__(
        self,
        id: str = "",
        gate_code: str = "FLOOD-GATE-ENTRY-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Basement Ramp Threshold",
        street_water_level_cm: float = 8.5,
        deploy_trigger_water_cm: float = 25.0,
        hydraulic_ram_pressure_psi: float = 2200.0,
        barrier_height_deployed_meters: float = 1.20,
        gate_position_state: str = "IN_GROUND_RECEDED_NORMAL",  # IN_GROUND_RECEDED_NORMAL | RAISING | FULLY_DEPLOYED_SEALED
        waterproof_seal_integrity_pct: float = 100.0,
        status: str = "FLOOD_GATE_ARMED_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"flg-{uuid.uuid4().hex[:8]}"
        self.gate_code = gate_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.street_water_level_cm = street_water_level_cm
        self.deploy_trigger_water_cm = deploy_trigger_water_cm
        self.hydraulic_ram_pressure_psi = hydraulic_ram_pressure_psi
        self.barrier_height_deployed_meters = barrier_height_deployed_meters
        self.gate_position_state = gate_position_state
        self.waterproof_seal_integrity_pct = waterproof_seal_integrity_pct
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "gate_code": self.gate_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "street_water_level_cm": self.street_water_level_cm,
            "deploy_trigger_water_cm": self.deploy_trigger_water_cm,
            "hydraulic_ram_pressure_psi": self.hydraulic_ram_pressure_psi,
            "barrier_height_deployed_meters": self.barrier_height_deployed_meters,
            "gate_position_state": self.gate_position_state,
            "waterproof_seal_integrity_pct": self.waterproof_seal_integrity_pct,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FloodGateRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS flood_barrier_gate_nodes (
                    id TEXT PRIMARY KEY,
                    gate_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    street_water_level_cm REAL DEFAULT 8.5,
                    deploy_trigger_water_cm REAL DEFAULT 25.0,
                    hydraulic_ram_pressure_psi REAL DEFAULT 2200.0,
                    barrier_height_deployed_meters REAL DEFAULT 1.20,
                    gate_position_state TEXT DEFAULT 'IN_GROUND_RECEDED_NORMAL',
                    waterproof_seal_integrity_pct REAL DEFAULT 100.0,
                    status TEXT DEFAULT 'FLOOD_GATE_ARMED_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> FloodBarrierGateNode:
        FloodGateRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM flood_barrier_gate_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return FloodBarrierGateNode(**dict(row))
            node = FloodBarrierGateNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO flood_barrier_gate_nodes (
                    id, gate_code, zone_id, floor_level,
                    street_water_level_cm, deploy_trigger_water_cm,
                    hydraulic_ram_pressure_psi,
                    barrier_height_deployed_meters,
                    gate_position_state, waterproof_seal_integrity_pct,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.gate_code, node.zone_id, node.floor_level,
                node.street_water_level_cm, node.deploy_trigger_water_cm,
                node.hydraulic_ram_pressure_psi,
                node.barrier_height_deployed_meters,
                node.gate_position_state,
                node.waterproof_seal_integrity_pct,
                node.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

FloodGateRepository.init_table()
