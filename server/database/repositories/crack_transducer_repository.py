"""
SmartPark LoRaWAN Concrete Structural Crack Displacement Transducer Repository Layer
Manages long-range wireless sub-millimeter LVDT crack width displacement sensors (mm) tracking shear fractures across concrete columns.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CrackTransducerNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "CRACK-LVDT-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Primary Support Column 14",
        crack_opening_displacement_mm: float = 0.12,  # ACI 224R allowable < 0.30 mm
        allowable_crack_limit_mm: float = 0.30,
        crack_growth_rate_mm_per_year: float = 0.01,
        lorawan_rssi_dbm: int = -78,
        structural_integrity_status: str = "MICROCRACK_STABLE_WITHIN_LIMITS",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ctn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.crack_opening_displacement_mm = crack_opening_displacement_mm
        self.allowable_crack_limit_mm = allowable_crack_limit_mm
        self.crack_growth_rate_mm_per_year = crack_growth_rate_mm_per_year
        self.lorawan_rssi_dbm = lorawan_rssi_dbm
        self.structural_integrity_status = structural_integrity_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "crack_opening_displacement_mm": self.crack_opening_displacement_mm,
            "allowable_crack_limit_mm": self.allowable_crack_limit_mm,
            "crack_growth_rate_mm_per_year": self.crack_growth_rate_mm_per_year,
            "lorawan_rssi_dbm": self.lorawan_rssi_dbm,
            "structural_integrity_status": self.structural_integrity_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CrackTransducerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS crack_transducer_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    crack_opening_displacement_mm REAL DEFAULT 0.12,
                    allowable_crack_limit_mm REAL DEFAULT 0.30,
                    crack_growth_rate_mm_per_year REAL DEFAULT 0.01,
                    lorawan_rssi_dbm INTEGER DEFAULT -78,
                    structural_integrity_status TEXT DEFAULT 'MICROCRACK_STABLE_WITHIN_LIMITS',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> CrackTransducerNode:
        CrackTransducerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM crack_transducer_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return CrackTransducerNode(**dict(row))
            node = CrackTransducerNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO crack_transducer_nodes (
                    id, sensor_code, zone_id, floor_level,
                    crack_opening_displacement_mm,
                    allowable_crack_limit_mm,
                    crack_growth_rate_mm_per_year,
                    lorawan_rssi_dbm, structural_integrity_status,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.crack_opening_displacement_mm,
                node.allowable_crack_limit_mm,
                node.crack_growth_rate_mm_per_year,
                node.lorawan_rssi_dbm, node.structural_integrity_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

CrackTransducerRepository.init_table()
