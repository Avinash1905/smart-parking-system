"""
SmartPark Impressed Current Cathodic Protection (ICCP) Rebar Anti-Corrosion Repository Layer
Manages mixed metal oxide (MMO) titanium ribbon anodes, negative polarization voltage (mV), and concrete rebar corrosion prevention.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CathodicProtectionNode:
    def __init__(
        self,
        id: str = "",
        node_code: str = "ICCP-ANODE-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 De-Icing Salt Exposure Deck",
        polarization_potential_mv: float = -850.0,  # NACE SP0169 standard -850 mV CSE criterion
        impressed_current_amperes: float = 2.4,
        rectifier_voltage_volts: float = 12.8,
        anode_type: str = "MMO_TITANIUM_RIBBON_MESH",
        protection_state: str = "CATHODIC_IMMUNITY_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"icp-{uuid.uuid4().hex[:8]}"
        self.node_code = node_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.polarization_potential_mv = polarization_potential_mv
        self.impressed_current_amperes = impressed_current_amperes
        self.rectifier_voltage_volts = rectifier_voltage_volts
        self.anode_type = anode_type
        self.protection_state = protection_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "node_code": self.node_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "polarization_potential_mv": self.polarization_potential_mv,
            "impressed_current_amperes": self.impressed_current_amperes,
            "rectifier_voltage_volts": self.rectifier_voltage_volts,
            "anode_type": self.anode_type,
            "protection_state": self.protection_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CathodicProtectionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cathodic_protection_nodes (
                    id TEXT PRIMARY KEY,
                    node_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    polarization_potential_mv REAL DEFAULT -850.0,
                    impressed_current_amperes REAL DEFAULT 2.4,
                    rectifier_voltage_volts REAL DEFAULT 12.8,
                    anode_type TEXT DEFAULT 'MMO_TITANIUM_RIBBON_MESH',
                    protection_state TEXT DEFAULT 'CATHODIC_IMMUNITY_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> CathodicProtectionNode:
        CathodicProtectionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cathodic_protection_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return CathodicProtectionNode(**dict(row))
            node = CathodicProtectionNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO cathodic_protection_nodes (
                    id, node_code, zone_id, floor_level,
                    polarization_potential_mv, impressed_current_amperes,
                    rectifier_voltage_volts, anode_type,
                    protection_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.node_code, node.zone_id, node.floor_level,
                node.polarization_potential_mv,
                node.impressed_current_amperes,
                node.rectifier_voltage_volts, node.anode_type,
                node.protection_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

CathodicProtectionRepository.init_table()
