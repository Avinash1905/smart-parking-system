"""
SmartPark Indoor Air Quality (IAQ) & Underground Ventilation Repository Layer
Monitors carbon monoxide (CO ppm), air toxic levels, and jet ventilation fans across underground levels B1/B2.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class IAQSensorNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "IAQ-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "B1",
        carbon_monoxide_ppm: float = 14.2,
        nitrogen_dioxide_ppm: float = 0.08,
        temperature_celsius: float = 26.4,
        ventilation_jet_fan_status: str = "OFF_STANDBY",  # OFF_STANDBY | LOW_SPEED | HIGH_SPEED_ACTIVE
        air_quality_index: str = "GOOD",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"iaq-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.carbon_monoxide_ppm = carbon_monoxide_ppm
        self.nitrogen_dioxide_ppm = nitrogen_dioxide_ppm
        self.temperature_celsius = temperature_celsius
        self.ventilation_jet_fan_status = ventilation_jet_fan_status
        self.air_quality_index = air_quality_index
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "carbon_monoxide_ppm": self.carbon_monoxide_ppm,
            "nitrogen_dioxide_ppm": self.nitrogen_dioxide_ppm,
            "temperature_celsius": self.temperature_celsius,
            "ventilation_jet_fan_status": self.ventilation_jet_fan_status,
            "air_quality_index": self.air_quality_index,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class IAQRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS iaq_sensor_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    carbon_monoxide_ppm REAL DEFAULT 14.2,
                    nitrogen_dioxide_ppm REAL DEFAULT 0.08,
                    temperature_celsius REAL DEFAULT 26.4,
                    ventilation_jet_fan_status TEXT DEFAULT 'OFF_STANDBY',
                    air_quality_index TEXT DEFAULT 'GOOD',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(node: IAQSensorNode) -> bool:
        IAQRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO iaq_sensor_nodes (
                    id, sensor_code, zone_id, floor_level,
                    carbon_monoxide_ppm, nitrogen_dioxide_ppm,
                    temperature_celsius, ventilation_jet_fan_status,
                    air_quality_index, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.carbon_monoxide_ppm, node.nitrogen_dioxide_ppm,
                node.temperature_celsius, node.ventilation_jet_fan_status,
                node.air_quality_index, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_by_zone(zone_id: str = "zone-pub-01") -> List[IAQSensorNode]:
        IAQRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM iaq_sensor_nodes WHERE zone_id = ?", (zone_id,))
            return [IAQSensorNode(**dict(r)) for r in cursor.fetchall()]

IAQRepository.init_table()
