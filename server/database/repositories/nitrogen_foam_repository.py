"""
SmartPark Nitrogen Compressed Air Foam System (N-CAFS) EV Battery Fire Suppression Repository Layer
Manages high-expansion nitrogen foam injection manifolds, 1:20 expansion ratios, and thermal runaway lithium battery oxygen starvation blankets.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class NitrogenFoamNode:
    def __init__(
        self,
        id: str = "",
        system_code: str = "N-CAFS-SUPPRESSION-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 EV Charging Zone",
        nitrogen_gas_pressure_psi: float = 1850.0,
        foam_concentrate_tank_liters: float = 800.0,
        expansion_ratio: str = "1:20_EXPANSION_NITROGEN_FOAM",
        ev_fire_smother_readiness: str = "RAPID_BATTERY_SMOTHER_ARMED",
        discharge_rate_gpm: float = 400.0,
        system_state: str = "PRESSURE_CONTAINMENT_HEALTHY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"nfn-{uuid.uuid4().hex[:8]}"
        self.system_code = system_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.nitrogen_gas_pressure_psi = nitrogen_gas_pressure_psi
        self.foam_concentrate_tank_liters = foam_concentrate_tank_liters
        self.expansion_ratio = expansion_ratio
        self.ev_fire_smother_readiness = ev_fire_smother_readiness
        self.discharge_rate_gpm = discharge_rate_gpm
        self.system_state = system_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "system_code": self.system_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "nitrogen_gas_pressure_psi": self.nitrogen_gas_pressure_psi,
            "foam_concentrate_tank_liters": self.foam_concentrate_tank_liters,
            "expansion_ratio": self.expansion_ratio,
            "ev_fire_smother_readiness": self.ev_fire_smother_readiness,
            "discharge_rate_gpm": self.discharge_rate_gpm,
            "system_state": self.system_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class NitrogenFoamRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS nitrogen_foam_nodes (
                    id TEXT PRIMARY KEY,
                    system_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    nitrogen_gas_pressure_psi REAL DEFAULT 1850.0,
                    foam_concentrate_tank_liters REAL DEFAULT 800.0,
                    expansion_ratio TEXT DEFAULT '1:20_EXPANSION_NITROGEN_FOAM',
                    ev_fire_smother_readiness TEXT DEFAULT 'RAPID_BATTERY_SMOTHER_ARMED',
                    discharge_rate_gpm REAL DEFAULT 400.0,
                    system_state TEXT DEFAULT 'PRESSURE_CONTAINMENT_HEALTHY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> NitrogenFoamNode:
        NitrogenFoamRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM nitrogen_foam_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return NitrogenFoamNode(**dict(row))
            node = NitrogenFoamNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO nitrogen_foam_nodes (
                    id, system_code, zone_id, floor_level,
                    nitrogen_gas_pressure_psi,
                    foam_concentrate_tank_liters, expansion_ratio,
                    ev_fire_smother_readiness, discharge_rate_gpm,
                    system_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.system_code, node.zone_id, node.floor_level,
                node.nitrogen_gas_pressure_psi,
                node.foam_concentrate_tank_liters,
                node.expansion_ratio, node.ev_fire_smother_readiness,
                node.discharge_rate_gpm, node.system_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

NitrogenFoamRepository.init_table()
