"""
SmartPark Continuous Tethered Surveillance Drone Air Station Repository Layer
Manages micro-tethered high-voltage power lines providing uninterrupted 24/7 aerial perimeter security overlooking parking grounds.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TetheredDroneNode:
    def __init__(
        self,
        id: str = "",
        station_code: str = "TETHER-DRONE-ROOF-01",
        zone_id: str = "zone-pub-01",
        tether_altitude_meters: float = 45.0,
        tether_cable_tension_newtons: float = 28.4,
        camera_optical_zoom_ratio: str = "30X_OPTICAL_FLIR_4K",
        airborne_continuous_uptime_hours: float = 168.5,
        optical_perimeter_coverage_pct: float = 100.0,
        flight_state: str = "PERSISTENT_AIRBORNE_HOVER",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"tdn-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.tether_altitude_meters = tether_altitude_meters
        self.tether_cable_tension_newtons = tether_cable_tension_newtons
        self.camera_optical_zoom_ratio = camera_optical_zoom_ratio
        self.airborne_continuous_uptime_hours = airborne_continuous_uptime_hours
        self.optical_perimeter_coverage_pct = optical_perimeter_coverage_pct
        self.flight_state = flight_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "tether_altitude_meters": self.tether_altitude_meters,
            "tether_cable_tension_newtons": self.tether_cable_tension_newtons,
            "camera_optical_zoom_ratio": self.camera_optical_zoom_ratio,
            "airborne_continuous_uptime_hours": self.airborne_continuous_uptime_hours,
            "optical_perimeter_coverage_pct": self.optical_perimeter_coverage_pct,
            "flight_state": self.flight_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class TetheredDroneRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tethered_drone_nodes (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    tether_altitude_meters REAL DEFAULT 45.0,
                    tether_cable_tension_newtons REAL DEFAULT 28.4,
                    camera_optical_zoom_ratio TEXT DEFAULT '30X_OPTICAL_FLIR_4K',
                    airborne_continuous_uptime_hours REAL DEFAULT 168.5,
                    optical_perimeter_coverage_pct REAL DEFAULT 100.0,
                    flight_state TEXT DEFAULT 'PERSISTENT_AIRBORNE_HOVER',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> TetheredDroneNode:
        TetheredDroneRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tethered_drone_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return TetheredDroneNode(**dict(row))
            node = TetheredDroneNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO tethered_drone_nodes (
                    id, station_code, zone_id, tether_altitude_meters,
                    tether_cable_tension_newtons,
                    camera_optical_zoom_ratio,
                    airborne_continuous_uptime_hours,
                    optical_perimeter_coverage_pct, flight_state,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.station_code, node.zone_id,
                node.tether_altitude_meters,
                node.tether_cable_tension_newtons,
                node.camera_optical_zoom_ratio,
                node.airborne_continuous_uptime_hours,
                node.optical_perimeter_coverage_pct,
                node.flight_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

TetheredDroneRepository.init_table()
