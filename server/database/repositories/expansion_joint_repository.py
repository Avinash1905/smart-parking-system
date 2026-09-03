"""
SmartPark Concrete Expansion Joint Displacement & Thermal Movement Repository Layer
Manages linear variable differential transformer (LVDT) sensors measuring millimeter joint gaps in multi-level concrete decks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ExpansionJointSensorNode:
    def __init__(
        self,
        id: str = "",
        joint_code: str = "JOINT-LVDT-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Expansion Span",
        gap_displacement_mm: float = 24.8,
        nominal_design_gap_mm: float = 25.0,
        thermal_expansion_delta_mm: float = -0.2,
        elastomeric_seal_integrity_pct: float = 98.2,
        structural_status: str = "NOMINAL_MOVEMENT",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"jnt-{uuid.uuid4().hex[:8]}"
        self.joint_code = joint_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.gap_displacement_mm = gap_displacement_mm
        self.nominal_design_gap_mm = nominal_design_gap_mm
        self.thermal_expansion_delta_mm = thermal_expansion_delta_mm
        self.elastomeric_seal_integrity_pct = elastomeric_seal_integrity_pct
        self.structural_status = structural_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "joint_code": self.joint_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "gap_displacement_mm": self.gap_displacement_mm,
            "nominal_design_gap_mm": self.nominal_design_gap_mm,
            "thermal_expansion_delta_mm": self.thermal_expansion_delta_mm,
            "elastomeric_seal_integrity_pct": self.elastomeric_seal_integrity_pct,
            "structural_status": self.structural_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ExpansionJointRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS expansion_joint_sensor_nodes (
                    id TEXT PRIMARY KEY,
                    joint_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    gap_displacement_mm REAL DEFAULT 24.8,
                    nominal_design_gap_mm REAL DEFAULT 25.0,
                    thermal_expansion_delta_mm REAL DEFAULT -0.2,
                    elastomeric_seal_integrity_pct REAL DEFAULT 98.2,
                    structural_status TEXT DEFAULT 'NOMINAL_MOVEMENT',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ExpansionJointSensorNode:
        ExpansionJointRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM expansion_joint_sensor_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return ExpansionJointSensorNode(**dict(row))
            node = ExpansionJointSensorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO expansion_joint_sensor_nodes (
                    id, joint_code, zone_id, floor_level,
                    gap_displacement_mm, nominal_design_gap_mm,
                    thermal_expansion_delta_mm,
                    elastomeric_seal_integrity_pct,
                    structural_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.joint_code, node.zone_id, node.floor_level,
                node.gap_displacement_mm, node.nominal_design_gap_mm,
                node.thermal_expansion_delta_mm,
                node.elastomeric_seal_integrity_pct,
                node.structural_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ExpansionJointRepository.init_table()
