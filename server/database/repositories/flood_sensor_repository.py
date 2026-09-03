"""
SmartPark Flood Detection & Stormwater Sump Pump Repository Layer
Monitors basement water levels (cm), stormwater overflow triggers, and automatic emergency drainage sump pumps.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FloodSensorNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "FLD-B2-SUMP-01",
        zone_id: str = "zone-pub-01",
        water_depth_cm: float = 2.4,
        alert_threshold_cm: float = 15.0,
        sump_pump_status: str = "AUTO_STANDBY",  # AUTO_STANDBY | PUMPING_ACTIVE | MAINTENANCE
        water_flow_rate_lpm: float = 0.0,
        flood_risk_level: str = "NORMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"fld-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.water_depth_cm = water_depth_cm
        self.alert_threshold_cm = alert_threshold_cm
        self.sump_pump_status = sump_pump_status
        self.water_flow_rate_lpm = water_flow_rate_lpm
        self.flood_risk_level = flood_risk_level
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "water_depth_cm": self.water_depth_cm,
            "alert_threshold_cm": self.alert_threshold_cm,
            "sump_pump_status": self.sump_pump_status,
            "water_flow_rate_lpm": self.water_flow_rate_lpm,
            "flood_risk_level": self.flood_risk_level,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FloodRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS flood_sensor_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    water_depth_cm REAL DEFAULT 2.4,
                    alert_threshold_cm REAL DEFAULT 15.0,
                    sump_pump_status TEXT DEFAULT 'AUTO_STANDBY',
                    water_flow_rate_lpm REAL DEFAULT 0.0,
                    flood_risk_level TEXT DEFAULT 'NORMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> FloodSensorNode:
        FloodRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM flood_sensor_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return FloodSensorNode(**dict(row))
            node = FloodSensorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO flood_sensor_nodes (id, sensor_code, zone_id, water_depth_cm, alert_threshold_cm, sump_pump_status, water_flow_rate_lpm, flood_risk_level, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (node.id, node.sensor_code, node.zone_id, node.water_depth_cm, node.alert_threshold_cm, node.sump_pump_status, node.water_flow_rate_lpm, node.flood_risk_level, datetime.utcnow().isoformat()))
            conn.commit()
            return node

FloodRepository.init_table()
