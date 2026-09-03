"""
SmartPark Electrical Surge Protective Device (SPD Class I+II) Repository Layer
Manages metal oxide varistor (MOV) 100kA 8/20µs surge arresters, transient voltage surge suppression (TVSS), and electrical grid lightning defense.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SPDSurgeNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "SPD-CLASS1-2-SUB-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Main Switchgear Substation",
        surge_discharge_current_ka: float = 100.0,
        voltage_protection_level_kv: float = 1.50,
        mov_thermal_disconnector_status: str = "MOV_ARRESTER_HEALTHY_GREEN",
        transient_spikes_clamped_today: int = 4,
        spd_class_rating: str = "TYPE_1_AND_TYPE_2_COMBINED",
        protection_state: str = "LIGHTNING_EMP_DEFENSE_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"spd-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.surge_discharge_current_ka = surge_discharge_current_ka
        self.voltage_protection_level_kv = voltage_protection_level_kv
        self.mov_thermal_disconnector_status = mov_thermal_disconnector_status
        self.transient_spikes_clamped_today = transient_spikes_clamped_today
        self.spd_class_rating = spd_class_rating
        self.protection_state = protection_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "surge_discharge_current_ka": self.surge_discharge_current_ka,
            "voltage_protection_level_kv": self.voltage_protection_level_kv,
            "mov_thermal_disconnector_status": self.mov_thermal_disconnector_status,
            "transient_spikes_clamped_today": self.transient_spikes_clamped_today,
            "spd_class_rating": self.spd_class_rating,
            "protection_state": self.protection_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SPDSurgeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS spd_surge_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    surge_discharge_current_ka REAL DEFAULT 100.0,
                    voltage_protection_level_kv REAL DEFAULT 1.50,
                    mov_thermal_disconnector_status TEXT DEFAULT 'MOV_ARRESTER_HEALTHY_GREEN',
                    transient_spikes_clamped_today INTEGER DEFAULT 4,
                    spd_class_rating TEXT DEFAULT 'TYPE_1_AND_TYPE_2_COMBINED',
                    protection_state TEXT DEFAULT 'LIGHTNING_EMP_DEFENSE_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SPDSurgeNode:
        SPDSurgeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM spd_surge_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SPDSurgeNode(**dict(row))
            node = SPDSurgeNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO spd_surge_nodes (
                    id, unit_code, zone_id, floor_level,
                    surge_discharge_current_ka,
                    voltage_protection_level_kv,
                    mov_thermal_disconnector_status,
                    transient_spikes_clamped_today,
                    spd_class_rating, protection_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.surge_discharge_current_ka,
                node.voltage_protection_level_kv,
                node.mov_thermal_disconnector_status,
                node.transient_spikes_clamped_today,
                node.spd_class_rating, node.protection_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SPDSurgeRepository.init_table()
