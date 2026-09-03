"""
SmartPark Early Streamer Emission (ESE) Lightning Arrester Repository Layer
Manages rooftop lightning protection air terminals, transient impulse surge counters (kA), and down-conductor earth impedance.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class LightningArresterNode:
    def __init__(
        self,
        id: str = "",
        terminal_code: str = "ESE-LIGHTNING-ROOF-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Rooftop Air Terminal Mast",
        total_strikes_intercepted: int = 14,
        last_strike_peak_ka: float = 48.5,
        earth_pit_resistance_ohms: float = 0.42,  # NFPA 780 Standard < 5.0 ohms
        down_conductor_continuity: bool = True,
        arrester_status: str = "CHARGED_INTERCEPTION_READY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"lit-{uuid.uuid4().hex[:8]}"
        self.terminal_code = terminal_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.total_strikes_intercepted = total_strikes_intercepted
        self.last_strike_peak_ka = last_strike_peak_ka
        self.earth_pit_resistance_ohms = earth_pit_resistance_ohms
        self.down_conductor_continuity = down_conductor_continuity
        self.arrester_status = arrester_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "terminal_code": self.terminal_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "total_strikes_intercepted": self.total_strikes_intercepted,
            "last_strike_peak_ka": self.last_strike_peak_ka,
            "earth_pit_resistance_ohms": self.earth_pit_resistance_ohms,
            "down_conductor_continuity": self.down_conductor_continuity,
            "arrester_status": self.arrester_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class LightningArresterRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS lightning_arrester_nodes (
                    id TEXT PRIMARY KEY,
                    terminal_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    total_strikes_intercepted INTEGER DEFAULT 14,
                    last_strike_peak_ka REAL DEFAULT 48.5,
                    earth_pit_resistance_ohms REAL DEFAULT 0.42,
                    down_conductor_continuity INTEGER DEFAULT 1,
                    arrester_status TEXT DEFAULT 'CHARGED_INTERCEPTION_READY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> LightningArresterNode:
        LightningArresterRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM lightning_arrester_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["down_conductor_continuity"] = bool(d["down_conductor_continuity"])
                return LightningArresterNode(**d)
            node = LightningArresterNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO lightning_arrester_nodes (
                    id, terminal_code, zone_id, floor_level,
                    total_strikes_intercepted, last_strike_peak_ka,
                    earth_pit_resistance_ohms,
                    down_conductor_continuity, arrester_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.terminal_code, node.zone_id, node.floor_level,
                node.total_strikes_intercepted, node.last_strike_peak_ka,
                node.earth_pit_resistance_ohms,
                1 if node.down_conductor_continuity else 0,
                node.arrester_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

LightningArresterRepository.init_table()
