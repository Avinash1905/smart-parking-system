"""
SmartPark Rainwater Harvesting & Cistern Reservoir Repository Layer
Manages underground rainwater storage cisterns, sand/carbon filtration stages, and recycled water distribution for deck maintenance.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RainwaterCisternNode:
    def __init__(
        self,
        id: str = "",
        cistern_code: str = "RWH-VAULT-01",
        zone_id: str = "zone-pub-01",
        total_capacity_liters: int = 50000,
        current_water_level_liters: int = 38400,
        fill_percentage: float = 76.8,
        sediment_filtration_status: str = "CLEAN_OPTIMAL",
        recycled_water_used_today_liters: int = 4200,
        status: str = "STORAGE_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rwh-{uuid.uuid4().hex[:8]}"
        self.cistern_code = cistern_code
        self.zone_id = zone_id
        self.total_capacity_liters = total_capacity_liters
        self.current_water_level_liters = current_water_level_liters
        self.fill_percentage = fill_percentage
        self.sediment_filtration_status = sediment_filtration_status
        self.recycled_water_used_today_liters = recycled_water_used_today_liters
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "cistern_code": self.cistern_code,
            "zone_id": self.zone_id,
            "total_capacity_liters": self.total_capacity_liters,
            "current_water_level_liters": self.current_water_level_liters,
            "fill_percentage": self.fill_percentage,
            "sediment_filtration_status": self.sediment_filtration_status,
            "recycled_water_used_today_liters": self.recycled_water_used_today_liters,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RainwaterHarvestingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rainwater_cistern_nodes (
                    id TEXT PRIMARY KEY,
                    cistern_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    total_capacity_liters INTEGER DEFAULT 50000,
                    current_water_level_liters INTEGER DEFAULT 38400,
                    fill_percentage REAL DEFAULT 76.8,
                    sediment_filtration_status TEXT DEFAULT 'CLEAN_OPTIMAL',
                    recycled_water_used_today_liters INTEGER DEFAULT 4200,
                    status TEXT DEFAULT 'STORAGE_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RainwaterCisternNode:
        RainwaterHarvestingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM rainwater_cistern_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return RainwaterCisternNode(**dict(row))
            node = RainwaterCisternNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO rainwater_cistern_nodes (
                    id, cistern_code, zone_id, total_capacity_liters,
                    current_water_level_liters, fill_percentage,
                    sediment_filtration_status,
                    recycled_water_used_today_liters, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.cistern_code, node.zone_id,
                node.total_capacity_liters,
                node.current_water_level_liters, node.fill_percentage,
                node.sediment_filtration_status,
                node.recycled_water_used_today_liters,
                node.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

RainwaterHarvestingRepository.init_table()
