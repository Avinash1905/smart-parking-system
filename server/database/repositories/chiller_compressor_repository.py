"""
SmartPark HVAC Central Plant Centrifugal Chiller & Magnetic Bearing Compressor Repository Layer
Manages magnetic levitation centrifugal chiller compressors, chilled water supply delta-T (6.5°C vs 12.0°C return), COP efficiency (6.8), and thermal comfort modulation.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ChillerCompressorNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "CHILLER-MAGLEV-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Basement B2 Central Energy Plant",
        chilled_water_supply_temp_celsius: float = 6.5,
        chilled_water_return_temp_celsius: float = 12.0,
        coefficient_of_performance_cop: float = 6.8,   # High-efficiency magnetic bearing COP > 6.0
        compressor_speed_rpm: float = 24500.0,
        magnetic_bearing_levitation_status: str = "MAGNETIC_BEARING_LEVITATING",
        plant_operational_state: str = "CENTRAL_CHILLER_OPTIMIZED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ccn-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.chilled_water_supply_temp_celsius = chilled_water_supply_temp_celsius
        self.chilled_water_return_temp_celsius = chilled_water_return_temp_celsius
        self.coefficient_of_performance_cop = coefficient_of_performance_cop
        self.compressor_speed_rpm = compressor_speed_rpm
        self.magnetic_bearing_levitation_status = magnetic_bearing_levitation_status
        self.plant_operational_state = plant_operational_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "chilled_water_supply_temp_celsius": self.chilled_water_supply_temp_celsius,
            "chilled_water_return_temp_celsius": self.chilled_water_return_temp_celsius,
            "coefficient_of_performance_cop": self.coefficient_of_performance_cop,
            "compressor_speed_rpm": self.compressor_speed_rpm,
            "magnetic_bearing_levitation_status": self.magnetic_bearing_levitation_status,
            "plant_operational_state": self.plant_operational_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ChillerCompressorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chiller_compressor_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    chilled_water_supply_temp_celsius REAL DEFAULT 6.5,
                    chilled_water_return_temp_celsius REAL DEFAULT 12.0,
                    coefficient_of_performance_cop REAL DEFAULT 6.8,
                    compressor_speed_rpm REAL DEFAULT 24500.0,
                    magnetic_bearing_levitation_status TEXT DEFAULT 'MAGNETIC_BEARING_LEVITATING',
                    plant_operational_state TEXT DEFAULT 'CENTRAL_CHILLER_OPTIMIZED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ChillerCompressorNode:
        ChillerCompressorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM chiller_compressor_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return ChillerCompressorNode(**dict(row))
            node = ChillerCompressorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO chiller_compressor_nodes (
                    id, unit_code, zone_id, floor_level,
                    chilled_water_supply_temp_celsius,
                    chilled_water_return_temp_celsius,
                    coefficient_of_performance_cop,
                    compressor_speed_rpm,
                    magnetic_bearing_levitation_status,
                    plant_operational_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.chilled_water_supply_temp_celsius,
                node.chilled_water_return_temp_celsius,
                node.coefficient_of_performance_cop,
                node.compressor_speed_rpm,
                node.magnetic_bearing_levitation_status,
                node.plant_operational_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ChillerCompressorRepository.init_table()
