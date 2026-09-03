"""
SmartPark Contactless BLE Key Drop & Valet Safe Repository Layer
Manages motorized key tumbler safety vaults, Bluetooth Low Energy (BLE) RSSI proximity unlocking, and audited valet vehicle key handoffs.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class KeySafeSlot:
    def __init__(
        self,
        id: str = "",
        slot_code: str = "KEY-VAULT-B1-04",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Valet Staging Kiosk",
        vehicle_plate: str = "KA-01-EQ-9988",
        key_rfid_fob_tag: str = "FOB-9820-A1",
        ble_rssi_proximity_dbm: int = -52,  # Close proximity < -65 dBm
        drawer_solenoid_state: str = "LOCKED_SECURE",
        authorized_valet_badge: str = "VALET-OP-104",
        handover_status: str = "KEY_DEPOSITED_VALET_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"kss-{uuid.uuid4().hex[:8]}"
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.vehicle_plate = vehicle_plate
        self.key_rfid_fob_tag = key_rfid_fob_tag
        self.ble_rssi_proximity_dbm = ble_rssi_proximity_dbm
        self.drawer_solenoid_state = drawer_solenoid_state
        self.authorized_valet_badge = authorized_valet_badge
        self.handover_status = handover_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "vehicle_plate": self.vehicle_plate,
            "key_rfid_fob_tag": self.key_rfid_fob_tag,
            "ble_rssi_proximity_dbm": self.ble_rssi_proximity_dbm,
            "drawer_solenoid_state": self.drawer_solenoid_state,
            "authorized_valet_badge": self.authorized_valet_badge,
            "handover_status": self.handover_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class KeySafeRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS key_safe_slots (
                    id TEXT PRIMARY KEY,
                    slot_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    key_rfid_fob_tag TEXT NOT NULL,
                    ble_rssi_proximity_dbm INTEGER DEFAULT -52,
                    drawer_solenoid_state TEXT DEFAULT 'LOCKED_SECURE',
                    authorized_valet_badge TEXT NOT NULL,
                    handover_status TEXT DEFAULT 'KEY_DEPOSITED_VALET_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> KeySafeSlot:
        KeySafeRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM key_safe_slots WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return KeySafeSlot(**dict(row))
            item = KeySafeSlot(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO key_safe_slots (
                    id, slot_code, zone_id, floor_level,
                    vehicle_plate, key_rfid_fob_tag,
                    ble_rssi_proximity_dbm, drawer_solenoid_state,
                    authorized_valet_badge, handover_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.slot_code, item.zone_id, item.floor_level,
                item.vehicle_plate, item.key_rfid_fob_tag,
                item.ble_rssi_proximity_dbm, item.drawer_solenoid_state,
                item.authorized_valet_badge, item.handover_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return item

KeySafeRepository.init_table()
