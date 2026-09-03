"""
SmartPark EV Battery Swapping Station (BSS) Repository Layer
Manages automated 90-second battery swap cabinets for 2-wheeler and 3-wheeler commercial delivery fleets.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BatterySwapCabinet:
    def __init__(
        self,
        id: str = "",
        cabinet_code: str = "BSS-CAB-01",
        zone_id: str = "zone-pub-01",
        total_battery_slots: int = 12,
        charged_ready_batteries: int = 9,
        charging_batteries: int = 3,
        battery_pack_model: str = "SMARTPARK-LFP-48V-30AH",
        swap_rate_inr: float = 85.0,
        status: str = "ONLINE_OPERATIONAL",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"bss-{uuid.uuid4().hex[:8]}"
        self.cabinet_code = cabinet_code
        self.zone_id = zone_id
        self.total_battery_slots = total_battery_slots
        self.charged_ready_batteries = charged_ready_batteries
        self.charging_batteries = charging_batteries
        self.battery_pack_model = battery_pack_model
        self.swap_rate_inr = swap_rate_inr
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "cabinet_code": self.cabinet_code,
            "zone_id": self.zone_id,
            "total_battery_slots": self.total_battery_slots,
            "charged_ready_batteries": self.charged_ready_batteries,
            "charging_batteries": self.charging_batteries,
            "battery_pack_model": self.battery_pack_model,
            "swap_rate_inr": self.swap_rate_inr,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class BatterySwapRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS battery_swap_cabinets (
                    id TEXT PRIMARY KEY,
                    cabinet_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    total_battery_slots INTEGER DEFAULT 12,
                    charged_ready_batteries INTEGER DEFAULT 9,
                    charging_batteries INTEGER DEFAULT 3,
                    battery_pack_model TEXT DEFAULT 'SMARTPARK-LFP-48V-30AH',
                    swap_rate_inr REAL DEFAULT 85.0,
                    status TEXT DEFAULT 'ONLINE_OPERATIONAL',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[BatterySwapCabinet]:
        BatterySwapRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM battery_swap_cabinets ORDER BY cabinet_code ASC")
            return [BatterySwapCabinet(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: BatterySwapCabinet) -> bool:
        BatterySwapRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO battery_swap_cabinets (
                    id, cabinet_code, zone_id, total_battery_slots,
                    charged_ready_batteries, charging_batteries,
                    battery_pack_model, swap_rate_inr, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.cabinet_code, item.zone_id,
                item.total_battery_slots, item.charged_ready_batteries,
                item.charging_batteries, item.battery_pack_model,
                item.swap_rate_inr, item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

BatterySwapRepository.init_table()
