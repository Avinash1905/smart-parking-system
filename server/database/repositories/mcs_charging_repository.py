"""
SmartPark Megawatt Charging System (MCS 1.2MW) Dispenser Repository Layer
Manages 1,250-volt / 1,000-amp commercial electric truck charging stalls, high-flow deionized dielectric cooling, and mega-power dispatch.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class MCSChargingDispenser:
    def __init__(
        self,
        id: str = "",
        dispenser_code: str = "MCS-DISPENSER-1200KW-01",
        slot_code: str = "MCS-01",
        zone_id: str = "zone-pub-01",
        output_voltage_v: float = 1250.0,
        output_current_amps: float = 960.0,
        instant_charging_power_kw: float = 1200.0,
        cable_coolant_flow_rate_lpm: float = 14.5,
        connector_temperature_celsius: float = 38.2,
        dispenser_status: str = "MEGAWATT_FAST_CHARGE_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"mcs-{uuid.uuid4().hex[:8]}"
        self.dispenser_code = dispenser_code
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.output_voltage_v = output_voltage_v
        self.output_current_amps = output_current_amps
        self.instant_charging_power_kw = instant_charging_power_kw
        self.cable_coolant_flow_rate_lpm = cable_coolant_flow_rate_lpm
        self.connector_temperature_celsius = connector_temperature_celsius
        self.dispenser_status = dispenser_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "dispenser_code": self.dispenser_code,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "output_voltage_v": self.output_voltage_v,
            "output_current_amps": self.output_current_amps,
            "instant_charging_power_kw": self.instant_charging_power_kw,
            "cable_coolant_flow_rate_lpm": self.cable_coolant_flow_rate_lpm,
            "connector_temperature_celsius": self.connector_temperature_celsius,
            "dispenser_status": self.dispenser_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class MCSChargingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS mcs_charging_dispensers (
                    id TEXT PRIMARY KEY,
                    dispenser_code TEXT UNIQUE NOT NULL,
                    slot_code TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    output_voltage_v REAL DEFAULT 1250.0,
                    output_current_amps REAL DEFAULT 960.0,
                    instant_charging_power_kw REAL DEFAULT 1200.0,
                    cable_coolant_flow_rate_lpm REAL DEFAULT 14.5,
                    connector_temperature_celsius REAL DEFAULT 38.2,
                    dispenser_status TEXT DEFAULT 'MEGAWATT_FAST_CHARGE_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> MCSChargingDispenser:
        MCSChargingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM mcs_charging_dispensers WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return MCSChargingDispenser(**dict(row))
            disp = MCSChargingDispenser(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO mcs_charging_dispensers (
                    id, dispenser_code, slot_code, zone_id,
                    output_voltage_v, output_current_amps,
                    instant_charging_power_kw,
                    cable_coolant_flow_rate_lpm,
                    connector_temperature_celsius, dispenser_status,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                disp.id, disp.dispenser_code, disp.slot_code,
                disp.zone_id, disp.output_voltage_v,
                disp.output_current_amps,
                disp.instant_charging_power_kw,
                disp.cable_coolant_flow_rate_lpm,
                disp.connector_temperature_celsius,
                disp.dispenser_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return disp

MCSChargingRepository.init_table()
