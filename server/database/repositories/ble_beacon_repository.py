"""
SmartPark BLE (Bluetooth Low Energy) Beacon Repository Layer
Manages roadside beacons, gate approach proximity triggers, and smartphone keyless gate clearances.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BLEBeacon:
    def __init__(
        self,
        id: str = "",
        beacon_uuid: str = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
        major: int = 101,
        minor: int = 1,
        location_name: str = "North Gate Entry Portal",
        zone_id: str = "zone-pub-01",
        tx_power_dbm: int = -59,
        rssi_threshold_dbm: int = -75,
        status: str = "ONLINE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"ble-{uuid.uuid4().hex[:8]}"
        self.beacon_uuid = beacon_uuid
        self.major = major
        self.minor = minor
        self.location_name = location_name
        self.zone_id = zone_id
        self.tx_power_dbm = tx_power_dbm
        self.rssi_threshold_dbm = rssi_threshold_dbm
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "beacon_uuid": self.beacon_uuid,
            "major": self.major,
            "minor": self.minor,
            "location_name": self.location_name,
            "zone_id": self.zone_id,
            "tx_power_dbm": self.tx_power_dbm,
            "rssi_threshold_dbm": self.rssi_threshold_dbm,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class BLERepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ble_beacons (
                    id TEXT PRIMARY KEY,
                    beacon_uuid TEXT NOT NULL,
                    major INTEGER NOT NULL,
                    minor INTEGER NOT NULL,
                    location_name TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    tx_power_dbm INTEGER DEFAULT -59,
                    rssi_threshold_dbm INTEGER DEFAULT -75,
                    status TEXT DEFAULT 'ONLINE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[BLEBeacon]:
        BLERepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ble_beacons ORDER BY major ASC")
            return [BLEBeacon(**dict(r)) for r in cursor.fetchall()]

BLERepository.init_table()
