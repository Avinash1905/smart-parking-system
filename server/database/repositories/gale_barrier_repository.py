"""
SmartPark Rooftop Anemometer & Motorized Gale Wind Barrier Repository Layer
Manages ultrasonic wind speed sensors, aerodynamic glass windscreen panels, and automated storm protection deployment.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class GaleBarrierNode:
    def __init__(
        self,
        id: str = "",
        barrier_code: str = "GALE-BARRIER-ROOF-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Open Deck",
        measured_wind_speed_knots: float = 14.5,
        wind_gust_peak_knots: float = 22.1,
        gale_actuation_threshold_knots: float = 35.0,
        aerodynamic_baffle_position_pct: int = 25,  # 0 = Retracted, 100 = Fully raised storm shield
        status: str = "WIND_CONDITIONS_SAFE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"gal-{uuid.uuid4().hex[:8]}"
        self.barrier_code = barrier_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.measured_wind_speed_knots = measured_wind_speed_knots
        self.wind_gust_peak_knots = wind_gust_peak_knots
        self.gale_actuation_threshold_knots = gale_actuation_threshold_knots
        self.aerodynamic_baffle_position_pct = aerodynamic_baffle_position_pct
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "barrier_code": self.barrier_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "measured_wind_speed_knots": self.measured_wind_speed_knots,
            "wind_gust_peak_knots": self.wind_gust_peak_knots,
            "gale_actuation_threshold_knots": self.gale_actuation_threshold_knots,
            "aerodynamic_baffle_position_pct": self.aerodynamic_baffle_position_pct,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class GaleBarrierRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS gale_barrier_nodes (
                    id TEXT PRIMARY KEY,
                    barrier_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    measured_wind_speed_knots REAL DEFAULT 14.5,
                    wind_gust_peak_knots REAL DEFAULT 22.1,
                    gale_actuation_threshold_knots REAL DEFAULT 35.0,
                    aerodynamic_baffle_position_pct INTEGER DEFAULT 25,
                    status TEXT DEFAULT 'WIND_CONDITIONS_SAFE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> GaleBarrierNode:
        GaleBarrierRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM gale_barrier_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return GaleBarrierNode(**dict(row))
            node = GaleBarrierNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO gale_barrier_nodes (
                    id, barrier_code, zone_id, floor_level,
                    measured_wind_speed_knots, wind_gust_peak_knots,
                    gale_actuation_threshold_knots,
                    aerodynamic_baffle_position_pct, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.barrier_code, node.zone_id, node.floor_level,
                node.measured_wind_speed_knots, node.wind_gust_peak_knots,
                node.gale_actuation_threshold_knots,
                node.aerodynamic_baffle_position_pct,
                node.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

GaleBarrierRepository.init_table()
