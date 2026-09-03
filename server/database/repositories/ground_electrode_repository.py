"""
SmartPark Substation Earth Ground Electrode Resistance & Soil Resistivity Repository Layer
Manages 3-point fall-of-potential earth ground resistance monitoring (Ohms), IEEE Std 81 compliance, and copper ground grid conductivity.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class GroundElectrodeNode:
    def __init__(
        self,
        id: str = "",
        grid_code: str = "EARTH-GROUND-GRID-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation Master Ground Well",
        measured_ground_resistance_ohms: float = 0.42,  # IEEE Std 81 safe limit < 1.00 Ohm
        allowable_resistance_limit_ohms: float = 1.00,
        soil_resistivity_ohm_meters: float = 24.5,
        copper_ground_rod_depth_meters: float = 18.0,
        earth_continuity_status: str = "GROUND_CONTINUITY_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"gen-{uuid.uuid4().hex[:8]}"
        self.grid_code = grid_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_ground_resistance_ohms = measured_ground_resistance_ohms
        self.allowable_resistance_limit_ohms = allowable_resistance_limit_ohms
        self.soil_resistivity_ohm_meters = soil_resistivity_ohm_meters
        self.copper_ground_rod_depth_meters = copper_ground_rod_depth_meters
        self.earth_continuity_status = earth_continuity_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "grid_code": self.grid_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_ground_resistance_ohms": self.measured_ground_resistance_ohms,
            "allowable_resistance_limit_ohms": self.allowable_resistance_limit_ohms,
            "soil_resistivity_ohm_meters": self.soil_resistivity_ohm_meters,
            "copper_ground_rod_depth_meters": self.copper_ground_rod_depth_meters,
            "earth_continuity_status": self.earth_continuity_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class GroundElectrodeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ground_electrode_nodes (
                    id TEXT PRIMARY KEY,
                    grid_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_ground_resistance_ohms REAL DEFAULT 0.42,
                    allowable_resistance_limit_ohms REAL DEFAULT 1.00,
                    soil_resistivity_ohm_meters REAL DEFAULT 24.5,
                    copper_ground_rod_depth_meters REAL DEFAULT 18.0,
                    earth_continuity_status TEXT DEFAULT 'GROUND_CONTINUITY_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> GroundElectrodeNode:
        GroundElectrodeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ground_electrode_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return GroundElectrodeNode(**dict(row))
            node = GroundElectrodeNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO ground_electrode_nodes (
                    id, grid_code, zone_id, floor_level,
                    measured_ground_resistance_ohms,
                    allowable_resistance_limit_ohms,
                    soil_resistivity_ohm_meters,
                    copper_ground_rod_depth_meters,
                    earth_continuity_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.grid_code, node.zone_id, node.floor_level,
                node.measured_ground_resistance_ohms,
                node.allowable_resistance_limit_ohms,
                node.soil_resistivity_ohm_meters,
                node.copper_ground_rod_depth_meters,
                node.earth_continuity_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

GroundElectrodeRepository.init_table()
