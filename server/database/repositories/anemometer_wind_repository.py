"""
SmartPark Rooftop Ultrasonic Anemometer & Extreme Wind Gust Protection Repository Layer
Manages 2D ultrasonic sonic-transit anemometers, real-time wind speed (m/s) & gust monitoring, rooftop barrier windbreak aerodynamics, and canopy protection.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AnemometerWindNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "ANEMOMETER-SONIC-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Open Parking Deck Perimeter",
        sustained_wind_speed_mps: float = 8.4,       # Beaufort 5 Moderate breeze
        peak_gust_speed_mps: float = 14.2,          # High-wind warning at > 20 m/s
        wind_direction_degrees: float = 245.0,      # WSW
        ambient_air_temp_celsius: float = 27.5,
        windbreak_louvers_state: str = "AERODYNAMIC_LOUVERS_OPEN",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"awn-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.sustained_wind_speed_mps = sustained_wind_speed_mps
        self.peak_gust_speed_mps = peak_gust_speed_mps
        self.wind_direction_degrees = wind_direction_degrees
        self.ambient_air_temp_celsius = ambient_air_temp_celsius
        self.windbreak_louvers_state = windbreak_louvers_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "sustained_wind_speed_mps": self.sustained_wind_speed_mps,
            "peak_gust_speed_mps": self.peak_gust_speed_mps,
            "wind_direction_degrees": self.wind_direction_degrees,
            "ambient_air_temp_celsius": self.ambient_air_temp_celsius,
            "windbreak_louvers_state": self.windbreak_louvers_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class AnemometerWindRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS anemometer_wind_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    sustained_wind_speed_mps REAL DEFAULT 8.4,
                    peak_gust_speed_mps REAL DEFAULT 14.2,
                    wind_direction_degrees REAL DEFAULT 245.0,
                    ambient_air_temp_celsius REAL DEFAULT 27.5,
                    windbreak_louvers_state TEXT DEFAULT 'AERODYNAMIC_LOUVERS_OPEN',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> AnemometerWindNode:
        AnemometerWindRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM anemometer_wind_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return AnemometerWindNode(**dict(row))
            node = AnemometerWindNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO anemometer_wind_nodes (
                    id, sensor_code, zone_id, floor_level,
                    sustained_wind_speed_mps,
                    peak_gust_speed_mps,
                    wind_direction_degrees,
                    ambient_air_temp_celsius,
                    windbreak_louvers_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id, node.floor_level,
                node.sustained_wind_speed_mps,
                node.peak_gust_speed_mps,
                node.wind_direction_degrees,
                node.ambient_air_temp_celsius,
                node.windbreak_louvers_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

AnemometerWindRepository.init_table()
