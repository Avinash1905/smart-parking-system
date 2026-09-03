"""
SmartPark Groundwater Hydrostatic Buoyancy Relief Valve Repository Layer
Manages foundation slab uplift pressure transducers (kPa), spring-loaded one-way relief check valves, and basement floor heaving prevention.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BuoyancyReliefValveNode:
    def __init__(
        self,
        id: str = "",
        valve_code: str = "BUOYANCY-VALVE-B3-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B3 Foundation Raft Slab",
        hydrostatic_uplift_pressure_kpa: float = 14.2,  # Threshold < 40.0 kPa
        allowable_slab_uplift_limit_kpa: float = 40.0,
        groundwater_table_depth_meters: float = -4.50,
        relief_valve_poppet_status: str = "PRESSURE_BALANCED_CLOSED",
        foundation_raft_integrity: str = "ZERO_UPLIFT_DISTORTION",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"brv-{uuid.uuid4().hex[:8]}"
        self.valve_code = valve_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.hydrostatic_uplift_pressure_kpa = hydrostatic_uplift_pressure_kpa
        self.allowable_slab_uplift_limit_kpa = allowable_slab_uplift_limit_kpa
        self.groundwater_table_depth_meters = groundwater_table_depth_meters
        self.relief_valve_poppet_status = relief_valve_poppet_status
        self.foundation_raft_integrity = foundation_raft_integrity
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "valve_code": self.valve_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "hydrostatic_uplift_pressure_kpa": self.hydrostatic_uplift_pressure_kpa,
            "allowable_slab_uplift_limit_kpa": self.allowable_slab_uplift_limit_kpa,
            "groundwater_table_depth_meters": self.groundwater_table_depth_meters,
            "relief_valve_poppet_status": self.relief_valve_poppet_status,
            "foundation_raft_integrity": self.foundation_raft_integrity,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BuoyancyValveRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS buoyancy_relief_valve_nodes (
                    id TEXT PRIMARY KEY,
                    valve_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    hydrostatic_uplift_pressure_kpa REAL DEFAULT 14.2,
                    allowable_slab_uplift_limit_kpa REAL DEFAULT 40.0,
                    groundwater_table_depth_meters REAL DEFAULT -4.50,
                    relief_valve_poppet_status TEXT DEFAULT 'PRESSURE_BALANCED_CLOSED',
                    foundation_raft_integrity TEXT DEFAULT 'ZERO_UPLIFT_DISTORTION',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> BuoyancyReliefValveNode:
        BuoyancyValveRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM buoyancy_relief_valve_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return BuoyancyReliefValveNode(**dict(row))
            node = BuoyancyReliefValveNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO buoyancy_relief_valve_nodes (
                    id, valve_code, zone_id, floor_level,
                    hydrostatic_uplift_pressure_kpa,
                    allowable_slab_uplift_limit_kpa,
                    groundwater_table_depth_meters,
                    relief_valve_poppet_status,
                    foundation_raft_integrity, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.valve_code, node.zone_id, node.floor_level,
                node.hydrostatic_uplift_pressure_kpa,
                node.allowable_slab_uplift_limit_kpa,
                node.groundwater_table_depth_meters,
                node.relief_valve_poppet_status,
                node.foundation_raft_integrity, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

BuoyancyValveRepository.init_table()
