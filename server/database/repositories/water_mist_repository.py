"""
SmartPark High-Pressure Water Mist EV Battery Quarantine Pod Repository Layer
Manages 140-bar high-pressure micro-droplet water mist nozzles, EV lithium-ion battery containment cells, and thermal runaway deluge suppression.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class WaterMistNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "WATER-MIST-POD-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 EV Containment Bay",
        system_operating_pressure_bar: float = 140.0,
        droplet_size_microns: float = 45.0,
        water_storage_liters: float = 12000.0,
        deluge_valve_armed: bool = True,
        containment_pod_status: str = "MIST_DELUGE_ARMED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"wmn-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.system_operating_pressure_bar = system_operating_pressure_bar
        self.droplet_size_microns = droplet_size_microns
        self.water_storage_liters = water_storage_liters
        self.deluge_valve_armed = deluge_valve_armed
        self.containment_pod_status = containment_pod_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "system_operating_pressure_bar": self.system_operating_pressure_bar,
            "droplet_size_microns": self.droplet_size_microns,
            "water_storage_liters": self.water_storage_liters,
            "deluge_valve_armed": self.deluge_valve_armed,
            "containment_pod_status": self.containment_pod_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class WaterMistRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS water_mist_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    system_operating_pressure_bar REAL DEFAULT 140.0,
                    droplet_size_microns REAL DEFAULT 45.0,
                    water_storage_liters REAL DEFAULT 12000.0,
                    deluge_valve_armed INTEGER DEFAULT 1,
                    containment_pod_status TEXT DEFAULT 'MIST_DELUGE_ARMED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> WaterMistNode:
        WaterMistRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM water_mist_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["deluge_valve_armed"] = bool(d["deluge_valve_armed"])
                return WaterMistNode(**d)
            node = WaterMistNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO water_mist_nodes (
                    id, unit_code, zone_id, floor_level,
                    system_operating_pressure_bar, droplet_size_microns,
                    water_storage_liters, deluge_valve_armed,
                    containment_pod_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.system_operating_pressure_bar,
                node.droplet_size_microns,
                node.water_storage_liters,
                1 if node.deluge_valve_armed else 0,
                node.containment_pod_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

WaterMistRepository.init_table()
