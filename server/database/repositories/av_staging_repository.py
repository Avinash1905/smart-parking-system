"""
SmartPark Autonomous Vehicle (AV) & Robotaxi Staging Repository Layer
Manages self-driving robotaxi holding queues, wireless inductive charging stalls, and fleet API handshakes.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AVStagingBay:
    def __init__(
        self,
        id: str = "",
        bay_code: str = "AV-STAGE-01",
        fleet_provider: str = "WAYMO_MOCK",
        vehicle_av_id: str = "AV-POD-802",
        charge_pad_type: str = "WIRELESS_INDUCTIVE_20KW",
        staging_status: str = "STAGED_READY_FOR_DISPATCH",
        zone_id: str = "zone-pub-01",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"av-{uuid.uuid4().hex[:8]}"
        self.bay_code = bay_code
        self.fleet_provider = fleet_provider
        self.vehicle_av_id = vehicle_av_id
        self.charge_pad_type = charge_pad_type
        self.staging_status = staging_status
        self.zone_id = zone_id
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "bay_code": self.bay_code,
            "fleet_provider": self.fleet_provider,
            "vehicle_av_id": self.vehicle_av_id,
            "charge_pad_type": self.charge_pad_type,
            "staging_status": self.staging_status,
            "zone_id": self.zone_id,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class AVStagingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS av_staging_bays (
                    id TEXT PRIMARY KEY,
                    bay_code TEXT UNIQUE NOT NULL,
                    fleet_provider TEXT NOT NULL,
                    vehicle_av_id TEXT NOT NULL,
                    charge_pad_type TEXT DEFAULT 'WIRELESS_INDUCTIVE_20KW',
                    staging_status TEXT DEFAULT 'STAGED_READY_FOR_DISPATCH',
                    zone_id TEXT NOT NULL,
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(bay: AVStagingBay) -> bool:
        AVStagingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO av_staging_bays (
                    id, bay_code, fleet_provider, vehicle_av_id,
                    charge_pad_type, staging_status, zone_id, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                bay.id, bay.bay_code, bay.fleet_provider,
                bay.vehicle_av_id, bay.charge_pad_type,
                bay.staging_status, bay.zone_id, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_all() -> List[AVStagingBay]:
        AVStagingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM av_staging_bays ORDER BY bay_code ASC")
            return [AVStagingBay(**dict(r)) for r in cursor.fetchall()]

AVStagingRepository.init_table()
