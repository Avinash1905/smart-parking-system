"""
SmartPark Deep Basement Sump Pit Sentry & Dual Submersible Pump Repository Layer
Manages dual 15 HP vortex submersible drainage pumps, high-level hydrostatic float switches, oil-water separator interceptors, and storm deluge evacuation.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SumpPitSentryNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "SUMP-PIT-SENTRY-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Basement B3 Deep Drainage Sump",
        water_level_pct: float = 28.5,            # Pump starts at > 60%
        lead_pump_current_amps: float = 14.2,     # 15 HP motor rated ~18A
        lag_pump_ready: bool = True,
        oil_sheen_detected: bool = False,
        oil_skimmer_valve_status: str = "OIL_INTERCEPTOR_NORMAL",
        sump_system_state: str = "DRAINAGE_AUTOMATIC_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"sps-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.water_level_pct = water_level_pct
        self.lead_pump_current_amps = lead_pump_current_amps
        self.lag_pump_ready = lag_pump_ready
        self.oil_sheen_detected = oil_sheen_detected
        self.oil_skimmer_valve_status = oil_skimmer_valve_status
        self.sump_system_state = sump_system_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "water_level_pct": self.water_level_pct,
            "lead_pump_current_amps": self.lead_pump_current_amps,
            "lag_pump_ready": self.lag_pump_ready,
            "oil_sheen_detected": self.oil_sheen_detected,
            "oil_skimmer_valve_status": self.oil_skimmer_valve_status,
            "sump_system_state": self.sump_system_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SumpPitSentryRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sump_pit_sentry_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    water_level_pct REAL DEFAULT 28.5,
                    lead_pump_current_amps REAL DEFAULT 14.2,
                    lag_pump_ready INTEGER DEFAULT 1,
                    oil_sheen_detected INTEGER DEFAULT 0,
                    oil_skimmer_valve_status TEXT DEFAULT 'OIL_INTERCEPTOR_NORMAL',
                    sump_system_state TEXT DEFAULT 'DRAINAGE_AUTOMATIC_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SumpPitSentryNode:
        SumpPitSentryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sump_pit_sentry_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["lag_pump_ready"] = bool(d["lag_pump_ready"])
                d["oil_sheen_detected"] = bool(d["oil_sheen_detected"])
                return SumpPitSentryNode(**d)
            node = SumpPitSentryNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO sump_pit_sentry_nodes (
                    id, unit_code, zone_id, floor_level,
                    water_level_pct, lead_pump_current_amps,
                    lag_pump_ready, oil_sheen_detected,
                    oil_skimmer_valve_status, sump_system_state,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.water_level_pct, node.lead_pump_current_amps,
                1 if node.lag_pump_ready else 0,
                1 if node.oil_sheen_detected else 0,
                node.oil_skimmer_valve_status,
                node.sump_system_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SumpPitSentryRepository.init_table()
