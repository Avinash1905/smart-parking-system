"""
SmartPark In-Motion Dynamic Induction Roadway EV Charging Track Repository Layer
Manages 85 kHz resonant magnetic coil arrays embedded beneath ramp concrete transferring 50 kW wirelessly to moving electric vehicles.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class RoadwayChargingTrack:
    def __init__(
        self,
        id: str = "",
        track_code: str = "IN-MOTION-ROADWAY-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Inbound Helical Ramp Roadway",
        resonant_frequency_khz: float = 85.0,  # SAE J2954 standard 81.38 - 90.00 kHz
        transfer_power_kw: float = 50.0,
        energy_transfer_efficiency_pct: float = 93.4,
        vehicles_charged_in_motion_today: int = 145,
        total_kwh_transferred_today: float = 218.0,
        track_operational_state: str = "DYNAMIC_CHARGING_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"rct-{uuid.uuid4().hex[:8]}"
        self.track_code = track_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.resonant_frequency_khz = resonant_frequency_khz
        self.transfer_power_kw = transfer_power_kw
        self.energy_transfer_efficiency_pct = energy_transfer_efficiency_pct
        self.vehicles_charged_in_motion_today = vehicles_charged_in_motion_today
        self.total_kwh_transferred_today = total_kwh_transferred_today
        self.track_operational_state = track_operational_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "track_code": self.track_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "resonant_frequency_khz": self.resonant_frequency_khz,
            "transfer_power_kw": self.transfer_power_kw,
            "energy_transfer_efficiency_pct": self.energy_transfer_efficiency_pct,
            "vehicles_charged_in_motion_today": self.vehicles_charged_in_motion_today,
            "total_kwh_transferred_today": self.total_kwh_transferred_today,
            "track_operational_state": self.track_operational_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class RoadwayChargingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS roadway_charging_tracks (
                    id TEXT PRIMARY KEY,
                    track_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    resonant_frequency_khz REAL DEFAULT 85.0,
                    transfer_power_kw REAL DEFAULT 50.0,
                    energy_transfer_efficiency_pct REAL DEFAULT 93.4,
                    vehicles_charged_in_motion_today INTEGER DEFAULT 145,
                    total_kwh_transferred_today REAL DEFAULT 218.0,
                    track_operational_state TEXT DEFAULT 'DYNAMIC_CHARGING_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> RoadwayChargingTrack:
        RoadwayChargingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM roadway_charging_tracks WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return RoadwayChargingTrack(**dict(row))
            track = RoadwayChargingTrack(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO roadway_charging_tracks (
                    id, track_code, zone_id, floor_level,
                    resonant_frequency_khz, transfer_power_kw,
                    energy_transfer_efficiency_pct,
                    vehicles_charged_in_motion_today,
                    total_kwh_transferred_today,
                    track_operational_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                track.id, track.track_code, track.zone_id,
                track.floor_level, track.resonant_frequency_khz,
                track.transfer_power_kw,
                track.energy_transfer_efficiency_pct,
                track.vehicles_charged_in_motion_today,
                track.total_kwh_transferred_today,
                track.track_operational_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return track

RoadwayChargingRepository.init_table()
