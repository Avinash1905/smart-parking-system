"""
SmartPark API-421 Oil-Water Coalescing Separator Repository Layer
Manages underground stormwater coalescing plate packs, hydrocarbon effluent discharge sensors (ppm), and automated oil skimmer drums.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class OilWaterSeparatorUnit:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "OWS-API421-B2-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B2 Drainage Vault",
        effluent_oil_concentration_ppm: float = 3.2,  # EPA Limit < 10.0 ppm
        retained_oil_layer_thickness_mm: float = 18.5,
        sludge_sediment_depth_cm: float = 12.0,
        motorized_oil_skimmer_active: bool = False,
        environmental_discharge_status: str = "DISCHARGE_PRISTINE_CLEAN",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ows-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.effluent_oil_concentration_ppm = effluent_oil_concentration_ppm
        self.retained_oil_layer_thickness_mm = retained_oil_layer_thickness_mm
        self.sludge_sediment_depth_cm = sludge_sediment_depth_cm
        self.motorized_oil_skimmer_active = motorized_oil_skimmer_active
        self.environmental_discharge_status = environmental_discharge_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "effluent_oil_concentration_ppm": self.effluent_oil_concentration_ppm,
            "retained_oil_layer_thickness_mm": self.retained_oil_layer_thickness_mm,
            "sludge_sediment_depth_cm": self.sludge_sediment_depth_cm,
            "motorized_oil_skimmer_active": self.motorized_oil_skimmer_active,
            "environmental_discharge_status": self.environmental_discharge_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class OilWaterSeparatorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS oil_water_separator_units (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    effluent_oil_concentration_ppm REAL DEFAULT 3.2,
                    retained_oil_layer_thickness_mm REAL DEFAULT 18.5,
                    sludge_sediment_depth_cm REAL DEFAULT 12.0,
                    motorized_oil_skimmer_active INTEGER DEFAULT 0,
                    environmental_discharge_status TEXT DEFAULT 'DISCHARGE_PRISTINE_CLEAN',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> OilWaterSeparatorUnit:
        OilWaterSeparatorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM oil_water_separator_units WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["motorized_oil_skimmer_active"] = bool(d["motorized_oil_skimmer_active"])
                return OilWaterSeparatorUnit(**d)
            unit = OilWaterSeparatorUnit(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO oil_water_separator_units (
                    id, unit_code, zone_id, floor_level,
                    effluent_oil_concentration_ppm,
                    retained_oil_layer_thickness_mm,
                    sludge_sediment_depth_cm,
                    motorized_oil_skimmer_active,
                    environmental_discharge_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                unit.id, unit.unit_code, unit.zone_id, unit.floor_level,
                unit.effluent_oil_concentration_ppm,
                unit.retained_oil_layer_thickness_mm,
                unit.sludge_sediment_depth_cm,
                1 if unit.motorized_oil_skimmer_active else 0,
                unit.environmental_discharge_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return unit

OilWaterSeparatorRepository.init_table()
