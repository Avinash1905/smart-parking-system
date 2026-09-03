"""
SmartPark Underground Sewage Ejector Duplex Grinder Pump Repository Layer
Manages dual submersible radial cutter vortex grinder pumps, wet well sewage depth (cm), and municipal sanitary sewer lift station discharge.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class GrinderPumpStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "GRINDER-PUMP-B3-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B3 Sanitary Wet Well",
        wet_well_depth_cm: float = 42.0,  # Pump ON Trigger > 75.0 cm
        lead_pump_current_amps: float = 0.0,
        cutter_blade_status: str = "RADIAL_CARBIDE_CUTTER_SHARP",
        discharge_flow_rate_lpm: float = 280.0,
        station_state: str = "WET_WELL_LEVEL_NORMAL_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"gps-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.wet_well_depth_cm = wet_well_depth_cm
        self.lead_pump_current_amps = lead_pump_current_amps
        self.cutter_blade_status = cutter_blade_status
        self.discharge_flow_rate_lpm = discharge_flow_rate_lpm
        self.station_state = station_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "wet_well_depth_cm": self.wet_well_depth_cm,
            "lead_pump_current_amps": self.lead_pump_current_amps,
            "cutter_blade_status": self.cutter_blade_status,
            "discharge_flow_rate_lpm": self.discharge_flow_rate_lpm,
            "station_state": self.station_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class GrinderPumpRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS grinder_pump_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    wet_well_depth_cm REAL DEFAULT 42.0,
                    lead_pump_current_amps REAL DEFAULT 0.0,
                    cutter_blade_status TEXT DEFAULT 'RADIAL_CARBIDE_CUTTER_SHARP',
                    discharge_flow_rate_lpm REAL DEFAULT 280.0,
                    station_state TEXT DEFAULT 'WET_WELL_LEVEL_NORMAL_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> GrinderPumpStation:
        GrinderPumpRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM grinder_pump_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return GrinderPumpStation(**dict(row))
            station = GrinderPumpStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO grinder_pump_stations (
                    id, station_code, zone_id, floor_level,
                    wet_well_depth_cm, lead_pump_current_amps,
                    cutter_blade_status, discharge_flow_rate_lpm,
                    station_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level, station.wet_well_depth_cm,
                station.lead_pump_current_amps,
                station.cutter_blade_status,
                station.discharge_flow_rate_lpm,
                station.station_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

GrinderPumpRepository.init_table()
