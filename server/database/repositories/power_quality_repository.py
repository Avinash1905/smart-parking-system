"""
SmartPark Electrical Power Quality & Total Harmonic Distortion (THD) Repository Layer
Manages grid harmonic filters, voltage sag/swell transient logs, and active power factor (cos phi) correction for EV charger banks.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PowerQualityNode:
    def __init__(
        self,
        id: str = "",
        meter_code: str = "PQM-SUBSTATION-01",
        zone_id: str = "zone-pub-01",
        total_harmonic_distortion_pct: float = 2.8,  # IEEE 519 Standard < 5.0%
        active_power_factor: float = 0.98,
        line_voltage_vrms: float = 415.2,
        grid_frequency_hz: float = 50.01,
        active_power_kw: float = 248.5,
        power_quality_tier: str = "IEEE_519_COMPLIANT_PRISTINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"pqm-{uuid.uuid4().hex[:8]}"
        self.meter_code = meter_code
        self.zone_id = zone_id
        self.total_harmonic_distortion_pct = total_harmonic_distortion_pct
        self.active_power_factor = active_power_factor
        self.line_voltage_vrms = line_voltage_vrms
        self.grid_frequency_hz = grid_frequency_hz
        self.active_power_kw = active_power_kw
        self.power_quality_tier = power_quality_tier
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "meter_code": self.meter_code,
            "zone_id": self.zone_id,
            "total_harmonic_distortion_pct": self.total_harmonic_distortion_pct,
            "active_power_factor": self.active_power_factor,
            "line_voltage_vrms": self.line_voltage_vrms,
            "grid_frequency_hz": self.grid_frequency_hz,
            "active_power_kw": self.active_power_kw,
            "power_quality_tier": self.power_quality_tier,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PowerQualityRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS power_quality_nodes (
                    id TEXT PRIMARY KEY,
                    meter_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    total_harmonic_distortion_pct REAL DEFAULT 2.8,
                    active_power_factor REAL DEFAULT 0.98,
                    line_voltage_vrms REAL DEFAULT 415.2,
                    grid_frequency_hz REAL DEFAULT 50.01,
                    active_power_kw REAL DEFAULT 248.5,
                    power_quality_tier TEXT DEFAULT 'IEEE_519_COMPLIANT_PRISTINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> PowerQualityNode:
        PowerQualityRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM power_quality_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return PowerQualityNode(**dict(row))
            node = PowerQualityNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO power_quality_nodes (
                    id, meter_code, zone_id,
                    total_harmonic_distortion_pct, active_power_factor,
                    line_voltage_vrms, grid_frequency_hz, active_power_kw,
                    power_quality_tier, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.meter_code, node.zone_id,
                node.total_harmonic_distortion_pct,
                node.active_power_factor, node.line_voltage_vrms,
                node.grid_frequency_hz, node.active_power_kw,
                node.power_quality_tier, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

PowerQualityRepository.init_table()
