"""
SmartPark Jet Fan Variable Frequency Drive (VFD) Inverter Matrix Repository Layer
Manages underground garage jet ventilation induction fans, motor RPM modulation, and airflow thrust velocity.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class VFDFanNode:
    def __init__(
        self,
        id: str = "",
        fan_code: str = "JET-FAN-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1",
        motor_power_kw: float = 3.5,
        current_rpm: int = 720,
        thrust_newtons: float = 38.5,
        vfd_frequency_hz: float = 30.0,
        inverter_health_status: str = "HEALTHY_VFD_MODULATING",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"vfd-{uuid.uuid4().hex[:8]}"
        self.fan_code = fan_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.motor_power_kw = motor_power_kw
        self.current_rpm = current_rpm
        self.thrust_newtons = thrust_newtons
        self.vfd_frequency_hz = vfd_frequency_hz
        self.inverter_health_status = inverter_health_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "fan_code": self.fan_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "motor_power_kw": self.motor_power_kw,
            "current_rpm": self.current_rpm,
            "thrust_newtons": self.thrust_newtons,
            "vfd_frequency_hz": self.vfd_frequency_hz,
            "inverter_health_status": self.inverter_health_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class VFDFanMatrixRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vfd_fan_nodes (
                    id TEXT PRIMARY KEY,
                    fan_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    motor_power_kw REAL DEFAULT 3.5,
                    current_rpm INTEGER DEFAULT 720,
                    thrust_newtons REAL DEFAULT 38.5,
                    vfd_frequency_hz REAL DEFAULT 30.0,
                    inverter_health_status TEXT DEFAULT 'HEALTHY_VFD_MODULATING',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[VFDFanNode]:
        VFDFanMatrixRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM vfd_fan_nodes ORDER BY fan_code ASC")
            return [VFDFanNode(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: VFDFanNode) -> bool:
        VFDFanMatrixRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO vfd_fan_nodes (
                    id, fan_code, zone_id, floor_level,
                    motor_power_kw, current_rpm, thrust_newtons,
                    vfd_frequency_hz, inverter_health_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.fan_code, item.zone_id, item.floor_level,
                item.motor_power_kw, item.current_rpm, item.thrust_newtons,
                item.vfd_frequency_hz, item.inverter_health_status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

VFDFanMatrixRepository.init_table()
