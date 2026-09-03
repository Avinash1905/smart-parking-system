"""
SmartPark Pedestrian Speed Gate Optical Turnstile Access Control Repository Layer
Manages bi-directional motorized glass flap barrier turnstiles, 32-point infrared anti-tailgating arrays, and QR/NFC pedestrian entry rates.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SpeedTurnstileLane:
    def __init__(
        self,
        id: str = "",
        lane_code: str = "TURNSTILE-LANE-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor G Pedestrian Turnstile Lobby",
        passage_mode: str = "BI_DIRECTIONAL_FREE_EXIT",
        pedestrians_passed_today: int = 1420,
        throughput_rate_ppm: int = 45,  # Pedestrians per minute
        tailgate_attempt_events_today: int = 1,
        glass_flap_barrier_state: str = "CLOSED_LOCKED_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"stl-{uuid.uuid4().hex[:8]}"
        self.lane_code = lane_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.passage_mode = passage_mode
        self.pedestrians_passed_today = pedestrians_passed_today
        self.throughput_rate_ppm = throughput_rate_ppm
        self.tailgate_attempt_events_today = tailgate_attempt_events_today
        self.glass_flap_barrier_state = glass_flap_barrier_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "lane_code": self.lane_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "passage_mode": self.passage_mode,
            "pedestrians_passed_today": self.pedestrians_passed_today,
            "throughput_rate_ppm": self.throughput_rate_ppm,
            "tailgate_attempt_events_today": self.tailgate_attempt_events_today,
            "glass_flap_barrier_state": self.glass_flap_barrier_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SpeedTurnstileRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS speed_turnstile_lanes (
                    id TEXT PRIMARY KEY,
                    lane_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    passage_mode TEXT DEFAULT 'BI_DIRECTIONAL_FREE_EXIT',
                    pedestrians_passed_today INTEGER DEFAULT 1420,
                    throughput_rate_ppm INTEGER DEFAULT 45,
                    tailgate_attempt_events_today INTEGER DEFAULT 1,
                    glass_flap_barrier_state TEXT DEFAULT 'CLOSED_LOCKED_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SpeedTurnstileLane:
        SpeedTurnstileRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM speed_turnstile_lanes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SpeedTurnstileLane(**dict(row))
            lane = SpeedTurnstileLane(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO speed_turnstile_lanes (
                    id, lane_code, zone_id, floor_level,
                    passage_mode, pedestrians_passed_today,
                    throughput_rate_ppm, tailgate_attempt_events_today,
                    glass_flap_barrier_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                lane.id, lane.lane_code, lane.zone_id, lane.floor_level,
                lane.passage_mode, lane.pedestrians_passed_today,
                lane.throughput_rate_ppm,
                lane.tailgate_attempt_events_today,
                lane.glass_flap_barrier_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return lane

SpeedTurnstileRepository.init_table()
