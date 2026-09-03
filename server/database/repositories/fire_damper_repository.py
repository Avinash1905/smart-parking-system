"""
SmartPark UL-555 Fire & Smoke Damper Electro-Thermal Fusible Link Repository Layer
Manages 3-hour fire barrier dampers, 165°F (74°C) fusible link status, motorized electro-thermal release actuators, and ventilation duct fire barrier integrity.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FireDamperNode:
    def __init__(
        self,
        id: str = "",
        damper_code: str = "FIRE-DAMPER-TRANS-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Substation Transformer Duct Penetration",
        damper_blade_position: str = "OPEN_AIRFLOW_NORMAL",  # OPEN_AIRFLOW_NORMAL | TRIPPED_SPRING_CLOSED | MANUAL_TEST
        fusible_link_temperature_rating_c: float = 74.0,     # 165°F fusible link
        current_duct_temperature_c: float = 24.8,
        ul_555_fire_endurance_hours: float = 3.0,
        spring_closure_torque_nm: float = 18.5,
        damper_health_status: str = "FIRE_BARRIER_ARMED_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"fdn-{uuid.uuid4().hex[:8]}"
        self.damper_code = damper_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.damper_blade_position = damper_blade_position
        self.fusible_link_temperature_rating_c = fusible_link_temperature_rating_c
        self.current_duct_temperature_c = current_duct_temperature_c
        self.ul_555_fire_endurance_hours = ul_555_fire_endurance_hours
        self.spring_closure_torque_nm = spring_closure_torque_nm
        self.damper_health_status = damper_health_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "damper_code": self.damper_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "damper_blade_position": self.damper_blade_position,
            "fusible_link_temperature_rating_c": self.fusible_link_temperature_rating_c,
            "current_duct_temperature_c": self.current_duct_temperature_c,
            "ul_555_fire_endurance_hours": self.ul_555_fire_endurance_hours,
            "spring_closure_torque_nm": self.spring_closure_torque_nm,
            "damper_health_status": self.damper_health_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FireDamperRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS fire_damper_nodes (
                    id TEXT PRIMARY KEY,
                    damper_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    damper_blade_position TEXT DEFAULT 'OPEN_AIRFLOW_NORMAL',
                    fusible_link_temperature_rating_c REAL DEFAULT 74.0,
                    current_duct_temperature_c REAL DEFAULT 24.8,
                    ul_555_fire_endurance_hours REAL DEFAULT 3.0,
                    spring_closure_torque_nm REAL DEFAULT 18.5,
                    damper_health_status TEXT DEFAULT 'FIRE_BARRIER_ARMED_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> FireDamperNode:
        FireDamperRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM fire_damper_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return FireDamperNode(**dict(row))
            node = FireDamperNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO fire_damper_nodes (
                    id, damper_code, zone_id, floor_level,
                    damper_blade_position,
                    fusible_link_temperature_rating_c,
                    current_duct_temperature_c,
                    ul_555_fire_endurance_hours,
                    spring_closure_torque_nm,
                    damper_health_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.damper_code, node.zone_id, node.floor_level,
                node.damper_blade_position,
                node.fusible_link_temperature_rating_c,
                node.current_duct_temperature_c,
                node.ul_555_fire_endurance_hours,
                node.spring_closure_torque_nm,
                node.damper_health_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

FireDamperRepository.init_table()
