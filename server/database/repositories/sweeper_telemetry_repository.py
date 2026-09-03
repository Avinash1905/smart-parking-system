"""
SmartPark Autonomous Robotic Floor Sweeper & Industrial Scrubber Repository Layer
Manages LiDAR obstacle navigation rovers, HEPA cyclonic floor dust collection, cleaning area coverage (sqm/h), and battery charging docking stations.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SweeperTelemetryNode:
    def __init__(
        self,
        id: str = "",
        rover_code: str = "SWEEPER-ROVER-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Driving Aisles",
        cleaning_coverage_sqm_h: float = 2400.0,
        hepa_filter_differential_pressure_pa: float = 145.0,  # Filter clean < 250 Pa
        water_tank_level_pct: int = 82,
        battery_soc_pct: int = 91,
        rover_mission_state: str = "AUTONOMOUS_SCRUBBING_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"str-{uuid.uuid4().hex[:8]}"
        self.rover_code = rover_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.cleaning_coverage_sqm_h = cleaning_coverage_sqm_h
        self.hepa_filter_differential_pressure_pa = hepa_filter_differential_pressure_pa
        self.water_tank_level_pct = water_tank_level_pct
        self.battery_soc_pct = battery_soc_pct
        self.rover_mission_state = rover_mission_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "rover_code": self.rover_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "cleaning_coverage_sqm_h": self.cleaning_coverage_sqm_h,
            "hepa_filter_differential_pressure_pa": self.hepa_filter_differential_pressure_pa,
            "water_tank_level_pct": self.water_tank_level_pct,
            "battery_soc_pct": self.battery_soc_pct,
            "rover_mission_state": self.rover_mission_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SweeperTelemetryRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sweeper_telemetry_nodes (
                    id TEXT PRIMARY KEY,
                    rover_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    cleaning_coverage_sqm_h REAL DEFAULT 2400.0,
                    hepa_filter_differential_pressure_pa REAL DEFAULT 145.0,
                    water_tank_level_pct INTEGER DEFAULT 82,
                    battery_soc_pct INTEGER DEFAULT 91,
                    rover_mission_state TEXT DEFAULT 'AUTONOMOUS_SCRUBBING_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SweeperTelemetryNode:
        SweeperTelemetryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sweeper_telemetry_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SweeperTelemetryNode(**dict(row))
            node = SweeperTelemetryNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO sweeper_telemetry_nodes (
                    id, rover_code, zone_id, floor_level,
                    cleaning_coverage_sqm_h,
                    hepa_filter_differential_pressure_pa,
                    water_tank_level_pct, battery_soc_pct,
                    rover_mission_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.rover_code, node.zone_id, node.floor_level,
                node.cleaning_coverage_sqm_h,
                node.hepa_filter_differential_pressure_pa,
                node.water_tank_level_pct, node.battery_soc_pct,
                node.rover_mission_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SweeperTelemetryRepository.init_table()
