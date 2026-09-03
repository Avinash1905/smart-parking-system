"""
SmartPark Bioretention Rain Garden & Stormwater Silt Trap Repository Layer
Manages engineered bio-soil filtration beds, effluent turbidity optical sensors (NTU), heavy metal bio-absorption, and clean municipal runoff.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RainGardenFilterNode:
    def __init__(
        self,
        id: str = "",
        filter_code: str = "BIO-RAIN-GARDEN-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Ground Perimeter Bioswale",
        influent_turbidity_ntu: float = 145.0,
        effluent_turbidity_ntu: float = 3.8,  # Clean Standard < 10.0 NTU
        heavy_metal_removal_rate_pct: float = 94.5,
        stormwater_volume_filtered_liters: float = 48200.0,
        filtration_status: str = "BIORETENTION_PRISTINE_FILTERING",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rgf-{uuid.uuid4().hex[:8]}"
        self.filter_code = filter_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.influent_turbidity_ntu = influent_turbidity_ntu
        self.effluent_turbidity_ntu = effluent_turbidity_ntu
        self.heavy_metal_removal_rate_pct = heavy_metal_removal_rate_pct
        self.stormwater_volume_filtered_liters = stormwater_volume_filtered_liters
        self.filtration_status = filtration_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "filter_code": self.filter_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "influent_turbidity_ntu": self.influent_turbidity_ntu,
            "effluent_turbidity_ntu": self.effluent_turbidity_ntu,
            "heavy_metal_removal_rate_pct": self.heavy_metal_removal_rate_pct,
            "stormwater_volume_filtered_liters": self.stormwater_volume_filtered_liters,
            "filtration_status": self.filtration_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RainGardenRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rain_garden_filter_nodes (
                    id TEXT PRIMARY KEY,
                    filter_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    influent_turbidity_ntu REAL DEFAULT 145.0,
                    effluent_turbidity_ntu REAL DEFAULT 3.8,
                    heavy_metal_removal_rate_pct REAL DEFAULT 94.5,
                    stormwater_volume_filtered_liters REAL DEFAULT 48200.0,
                    filtration_status TEXT DEFAULT 'BIORETENTION_PRISTINE_FILTERING',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RainGardenFilterNode:
        RainGardenRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM rain_garden_filter_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return RainGardenFilterNode(**dict(row))
            node = RainGardenFilterNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO rain_garden_filter_nodes (
                    id, filter_code, zone_id, floor_level,
                    influent_turbidity_ntu, effluent_turbidity_ntu,
                    heavy_metal_removal_rate_pct,
                    stormwater_volume_filtered_liters,
                    filtration_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.filter_code, node.zone_id, node.floor_level,
                node.influent_turbidity_ntu,
                node.effluent_turbidity_ntu,
                node.heavy_metal_removal_rate_pct,
                node.stormwater_volume_filtered_liters,
                node.filtration_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

RainGardenRepository.init_table()
