"""
SmartPark Automatic Wet-Pipe Fire Sprinkler & Standpipe Flow Switch Repository Layer
Manages vane-type waterflow detector switches, riser hydraulic pressure transducers (12.4 bar), fire pump jockey pressure maintenance, and NFPA 13 life-safety alarms.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SprinklerFlowNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "FLOW-SWITCH-SPRINKLER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Level 2 Fire Riser Standpipe Shaft",
        standpipe_static_pressure_bar: float = 12.4,  # Normal operating pressure 10-14 bar
        water_flow_rate_gpm: float = 0.0,              # Flow > 10 gpm triggers alarm
        jockey_pump_status: str = "PRESSURE_MAINTAINED_STANDBY",
        sprinkler_flow_alarm_active: bool = False,
        system_readiness_status: str = "WET_PIPE_HYDRAULIC_PRESSURIZED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"sfn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.standpipe_static_pressure_bar = standpipe_static_pressure_bar
        self.water_flow_rate_gpm = water_flow_rate_gpm
        self.jockey_pump_status = jockey_pump_status
        self.sprinkler_flow_alarm_active = sprinkler_flow_alarm_active
        self.system_readiness_status = system_readiness_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "standpipe_static_pressure_bar": self.standpipe_static_pressure_bar,
            "water_flow_rate_gpm": self.water_flow_rate_gpm,
            "jockey_pump_status": self.jockey_pump_status,
            "sprinkler_flow_alarm_active": self.sprinkler_flow_alarm_active,
            "system_readiness_status": self.system_readiness_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SprinklerFlowRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sprinkler_flow_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    standpipe_static_pressure_bar REAL DEFAULT 12.4,
                    water_flow_rate_gpm REAL DEFAULT 0.0,
                    jockey_pump_status TEXT DEFAULT 'PRESSURE_MAINTAINED_STANDBY',
                    sprinkler_flow_alarm_active INTEGER DEFAULT 0,
                    system_readiness_status TEXT DEFAULT 'WET_PIPE_HYDRAULIC_PRESSURIZED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SprinklerFlowNode:
        SprinklerFlowRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sprinkler_flow_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["sprinkler_flow_alarm_active"] = bool(d["sprinkler_flow_alarm_active"])
                return SprinklerFlowNode(**d)
            node = SprinklerFlowNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO sprinkler_flow_nodes (
                    id, sensor_code, zone_id, floor_level,
                    standpipe_static_pressure_bar,
                    water_flow_rate_gpm, jockey_pump_status,
                    sprinkler_flow_alarm_active,
                    system_readiness_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.standpipe_static_pressure_bar,
                node.water_flow_rate_gpm,
                node.jockey_pump_status,
                1 if node.sprinkler_flow_alarm_active else 0,
                node.system_readiness_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SprinklerFlowRepository.init_table()
