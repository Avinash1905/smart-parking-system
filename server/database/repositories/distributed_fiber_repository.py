"""
SmartPark Distributed Fiber Optic Brillouin & Rayleigh Slab Sensor Repository Layer
Manages embedded optical fiber distributed temperature sensing (DTS) and distributed strain sensing (DSS) across continuous 500m parking deck spans.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class DistributedFiberNode:
    def __init__(
        self,
        id: str = "",
        interrogator_code: str = "BOTDA-FIBER-SPAN-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor 1 Post-Tensioned Slab Embedding",
        total_fiber_length_meters: float = 500.0,
        spatial_resolution_meters: float = 0.50,
        max_measured_microstrain: float = 185.0,  # Allowable strain < 600 microstrain
        max_slab_temperature_celsius: float = 31.4,
        botda_interrogator_status: str = "FIBER_CONTINUITY_NOMINAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"dfn-{uuid.uuid4().hex[:8]}"
        self.interrogator_code = interrogator_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.total_fiber_length_meters = total_fiber_length_meters
        self.spatial_resolution_meters = spatial_resolution_meters
        self.max_measured_microstrain = max_measured_microstrain
        self.max_slab_temperature_celsius = max_slab_temperature_celsius
        self.botda_interrogator_status = botda_interrogator_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "interrogator_code": self.interrogator_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "total_fiber_length_meters": self.total_fiber_length_meters,
            "spatial_resolution_meters": self.spatial_resolution_meters,
            "max_measured_microstrain": self.max_measured_microstrain,
            "max_slab_temperature_celsius": self.max_slab_temperature_celsius,
            "botda_interrogator_status": self.botda_interrogator_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class DistributedFiberRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS distributed_fiber_nodes (
                    id TEXT PRIMARY KEY,
                    interrogator_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    total_fiber_length_meters REAL DEFAULT 500.0,
                    spatial_resolution_meters REAL DEFAULT 0.50,
                    max_measured_microstrain REAL DEFAULT 185.0,
                    max_slab_temperature_celsius REAL DEFAULT 31.4,
                    botda_interrogator_status TEXT DEFAULT 'FIBER_CONTINUITY_NOMINAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> DistributedFiberNode:
        DistributedFiberRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM distributed_fiber_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return DistributedFiberNode(**dict(row))
            node = DistributedFiberNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO distributed_fiber_nodes (
                    id, interrogator_code, zone_id, floor_level,
                    total_fiber_length_meters,
                    spatial_resolution_meters,
                    max_measured_microstrain,
                    max_slab_temperature_celsius,
                    botda_interrogator_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.interrogator_code, node.zone_id,
                node.floor_level, node.total_fiber_length_meters,
                node.spatial_resolution_meters,
                node.max_measured_microstrain,
                node.max_slab_temperature_celsius,
                node.botda_interrogator_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

DistributedFiberRepository.init_table()
