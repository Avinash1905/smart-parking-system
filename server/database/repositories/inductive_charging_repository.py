"""
SmartPark Inductive Wireless EV Charging Pad Repository Layer
Manages magnetic resonant underground charging plates (150kW), coil alignment millimeter guidance, and energy transfer efficiency.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class InductiveChargingPad:
    def __init__(
        self,
        id: str = "",
        pad_code: str = "WIRELESS-PAD-B1-01",
        slot_code: str = "W-01",
        zone_id: str = "zone-pub-01",
        max_power_output_kw: float = 150.0,
        current_transfer_power_kw: float = 142.5,
        magnetic_coupling_efficiency_pct: float = 94.8,
        coil_misalignment_offset_mm: float = 12.0,
        foreign_object_debris_clear: bool = True,
        charging_state: str = "WIRELESS_POWER_TRANSFER_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"ind-{uuid.uuid4().hex[:8]}"
        self.pad_code = pad_code
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.max_power_output_kw = max_power_output_kw
        self.current_transfer_power_kw = current_transfer_power_kw
        self.magnetic_coupling_efficiency_pct = magnetic_coupling_efficiency_pct
        self.coil_misalignment_offset_mm = coil_misalignment_offset_mm
        self.foreign_object_debris_clear = foreign_object_debris_clear
        self.charging_state = charging_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "pad_code": self.pad_code,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "max_power_output_kw": self.max_power_output_kw,
            "current_transfer_power_kw": self.current_transfer_power_kw,
            "magnetic_coupling_efficiency_pct": self.magnetic_coupling_efficiency_pct,
            "coil_misalignment_offset_mm": self.coil_misalignment_offset_mm,
            "foreign_object_debris_clear": self.foreign_object_debris_clear,
            "charging_state": self.charging_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class InductiveChargingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS inductive_charging_pads (
                    id TEXT PRIMARY KEY,
                    pad_code TEXT UNIQUE NOT NULL,
                    slot_code TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    max_power_output_kw REAL DEFAULT 150.0,
                    current_transfer_power_kw REAL DEFAULT 142.5,
                    magnetic_coupling_efficiency_pct REAL DEFAULT 94.8,
                    coil_misalignment_offset_mm REAL DEFAULT 12.0,
                    foreign_object_debris_clear INTEGER DEFAULT 1,
                    charging_state TEXT DEFAULT 'WIRELESS_POWER_TRANSFER_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_by_zone(zone_id: str = "zone-pub-01") -> List[InductiveChargingPad]:
        InductiveChargingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM inductive_charging_pads WHERE zone_id = ? ORDER BY slot_code ASC", (zone_id,))
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["foreign_object_debris_clear"] = bool(d["foreign_object_debris_clear"])
                res.append(InductiveChargingPad(**d))
            return res

    @staticmethod
    def create(item: InductiveChargingPad) -> bool:
        InductiveChargingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO inductive_charging_pads (
                    id, pad_code, slot_code, zone_id,
                    max_power_output_kw, current_transfer_power_kw,
                    magnetic_coupling_efficiency_pct,
                    coil_misalignment_offset_mm,
                    foreign_object_debris_clear, charging_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.pad_code, item.slot_code, item.zone_id,
                item.max_power_output_kw, item.current_transfer_power_kw,
                item.magnetic_coupling_efficiency_pct,
                item.coil_misalignment_offset_mm,
                1 if item.foreign_object_debris_clear else 0,
                item.charging_state, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

InductiveChargingRepository.init_table()
