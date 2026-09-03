"""
SmartPark Impressed Current Cathodic Protection (ICCP) Titanium Ribbon Anode Repository Layer
Manages mixed metal oxide (MMO) titanium mesh ribbons, DC rectifier polarization current (mA/m2), NACE SP0169 rebar polarization potential, and electrochemical corrosion prevention.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ImpressedCurrentNode:
    def __init__(
        self,
        id: str = "",
        rectifier_code: str = "ICCP-RECTIFIER-ZONE-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor 1 Rebar Embedment Grid",
        polarization_potential_mv_cse: float = -920.0,  # Protected potential -850 to -1100 mV CSE NACE
        output_current_density_ma_m2: float = 12.5,
        dc_rectifier_voltage_v: float = 6.4,
        instant_off_potential_mv: float = -885.0,
        cathodic_protection_status: str = "CATHODIC_POLARIZATION_OPTIMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"icn-{uuid.uuid4().hex[:8]}"
        self.rectifier_code = rectifier_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.polarization_potential_mv_cse = polarization_potential_mv_cse
        self.output_current_density_ma_m2 = output_current_density_ma_m2
        self.dc_rectifier_voltage_v = dc_rectifier_voltage_v
        self.instant_off_potential_mv = instant_off_potential_mv
        self.cathodic_protection_status = cathodic_protection_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "rectifier_code": self.rectifier_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "polarization_potential_mv_cse": self.polarization_potential_mv_cse,
            "output_current_density_ma_m2": self.output_current_density_ma_m2,
            "dc_rectifier_voltage_v": self.dc_rectifier_voltage_v,
            "instant_off_potential_mv": self.instant_off_potential_mv,
            "cathodic_protection_status": self.cathodic_protection_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ImpressedCurrentRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS impressed_current_nodes (
                    id TEXT PRIMARY KEY,
                    rectifier_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    polarization_potential_mv_cse REAL DEFAULT -920.0,
                    output_current_density_ma_m2 REAL DEFAULT 12.5,
                    dc_rectifier_voltage_v REAL DEFAULT 6.4,
                    instant_off_potential_mv REAL DEFAULT -885.0,
                    cathodic_protection_status TEXT DEFAULT 'CATHODIC_POLARIZATION_OPTIMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ImpressedCurrentNode:
        ImpressedCurrentRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM impressed_current_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return ImpressedCurrentNode(**dict(row))
            node = ImpressedCurrentNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO impressed_current_nodes (
                    id, rectifier_code, zone_id, floor_level,
                    polarization_potential_mv_cse,
                    output_current_density_ma_m2,
                    dc_rectifier_voltage_v,
                    instant_off_potential_mv,
                    cathodic_protection_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.rectifier_code, node.zone_id, node.floor_level,
                node.polarization_potential_mv_cse,
                node.output_current_density_ma_m2,
                node.dc_rectifier_voltage_v,
                node.instant_off_potential_mv,
                node.cathodic_protection_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

ImpressedCurrentRepository.init_table()
