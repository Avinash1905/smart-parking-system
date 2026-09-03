"""
SmartPark Dynamic Tariff Matrix & Peak Surge Pricing Engine Repository Layer
Manages multi-tiered hourly parking tariffs, progressive duration pricing curves, weekend/event surcharge multipliers, and real-time revenue yield optimization.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TariffMatrixRule:
    def __init__(
        self,
        id: str = "",
        rule_code: str = "TARIFF-SURGE-DYNAMIC-01",
        zone_id: str = "zone-pub-01",
        zone_name: str = "Municipal Central Parking",
        base_hourly_rate_inr: float = 20.0,
        peak_occupancy_threshold_pct: float = 85.0,
        surge_multiplier: float = 1.35,
        effective_hourly_rate_inr: float = 27.0,
        weekend_flat_discount_pct: float = 10.0,
        ev_charging_kwh_rate_inr: float = 12.5,
        rule_status: str = "SURGE_ALGORITHM_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"tmr-{uuid.uuid4().hex[:8]}"
        self.rule_code = rule_code
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.base_hourly_rate_inr = base_hourly_rate_inr
        self.peak_occupancy_threshold_pct = peak_occupancy_threshold_pct
        self.surge_multiplier = surge_multiplier
        self.effective_hourly_rate_inr = effective_hourly_rate_inr
        self.weekend_flat_discount_pct = weekend_flat_discount_pct
        self.ev_charging_kwh_rate_inr = ev_charging_kwh_rate_inr
        self.rule_status = rule_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "rule_code": self.rule_code,
            "zone_id": self.zone_id,
            "zone_name": self.zone_name,
            "base_hourly_rate_inr": self.base_hourly_rate_inr,
            "peak_occupancy_threshold_pct": self.peak_occupancy_threshold_pct,
            "surge_multiplier": self.surge_multiplier,
            "effective_hourly_rate_inr": self.effective_hourly_rate_inr,
            "weekend_flat_discount_pct": self.weekend_flat_discount_pct,
            "ev_charging_kwh_rate_inr": self.ev_charging_kwh_rate_inr,
            "rule_status": self.rule_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class TariffMatrixRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tariff_matrix_rules (
                    id TEXT PRIMARY KEY,
                    rule_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    zone_name TEXT NOT NULL,
                    base_hourly_rate_inr REAL DEFAULT 20.0,
                    peak_occupancy_threshold_pct REAL DEFAULT 85.0,
                    surge_multiplier REAL DEFAULT 1.35,
                    effective_hourly_rate_inr REAL DEFAULT 27.0,
                    weekend_flat_discount_pct REAL DEFAULT 10.0,
                    ev_charging_kwh_rate_inr REAL DEFAULT 12.5,
                    rule_status TEXT DEFAULT 'SURGE_ALGORITHM_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> TariffMatrixRule:
        TariffMatrixRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tariff_matrix_rules WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return TariffMatrixRule(**dict(row))
            rule = TariffMatrixRule(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO tariff_matrix_rules (
                    id, rule_code, zone_id, zone_name,
                    base_hourly_rate_inr, peak_occupancy_threshold_pct,
                    surge_multiplier, effective_hourly_rate_inr,
                    weekend_flat_discount_pct, ev_charging_kwh_rate_inr,
                    rule_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                rule.id, rule.rule_code, rule.zone_id, rule.zone_name,
                rule.base_hourly_rate_inr, rule.peak_occupancy_threshold_pct,
                rule.surge_multiplier, rule.effective_hourly_rate_inr,
                rule.weekend_flat_discount_pct, rule.ev_charging_kwh_rate_inr,
                rule.rule_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return rule

TariffMatrixRepository.init_table()
