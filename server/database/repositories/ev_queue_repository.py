"""
SmartPark EV Fast-Charge Smart Queue & Energy Allocation Repository Layer
Manages virtual EV charging queues, dynamic kilowatt load balancing (kW), estimated wait times, and automated stall transition alerts.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class EVQueueItem:
    def __init__(
        self,
        id: str = "",
        queue_code: str = "EV-QUEUE-FAST-01",
        zone_id: str = "zone-pub-01",
        vehicle_plate: str = "KA-01-EQ-9988",
        requested_kwh: float = 45.0,
        battery_target_soc_pct: int = 80,
        queue_position: int = 2,
        estimated_wait_minutes: int = 8,
        allocated_charger_code: str = "CCS2-DC-150KW-04",
        queue_status: str = "WAITING_IN_QUEUE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"evq-{uuid.uuid4().hex[:8]}"
        self.queue_code = queue_code
        self.zone_id = zone_id
        self.vehicle_plate = vehicle_plate
        self.requested_kwh = requested_kwh
        self.battery_target_soc_pct = battery_target_soc_pct
        self.queue_position = queue_position
        self.estimated_wait_minutes = estimated_wait_minutes
        self.allocated_charger_code = allocated_charger_code
        self.queue_status = queue_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "queue_code": self.queue_code,
            "zone_id": self.zone_id,
            "vehicle_plate": self.vehicle_plate,
            "requested_kwh": self.requested_kwh,
            "battery_target_soc_pct": self.battery_target_soc_pct,
            "queue_position": self.queue_position,
            "estimated_wait_minutes": self.estimated_wait_minutes,
            "allocated_charger_code": self.allocated_charger_code,
            "queue_status": self.queue_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class EVQueueRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ev_queue_items (
                    id TEXT PRIMARY KEY,
                    queue_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    requested_kwh REAL DEFAULT 45.0,
                    battery_target_soc_pct INTEGER DEFAULT 80,
                    queue_position INTEGER DEFAULT 2,
                    estimated_wait_minutes INTEGER DEFAULT 8,
                    allocated_charger_code TEXT DEFAULT 'CCS2-DC-150KW-04',
                    queue_status TEXT DEFAULT 'WAITING_IN_QUEUE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> EVQueueItem:
        EVQueueRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ev_queue_items WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return EVQueueItem(**dict(row))
            item = EVQueueItem(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO ev_queue_items (
                    id, queue_code, zone_id, vehicle_plate,
                    requested_kwh, battery_target_soc_pct,
                    queue_position, estimated_wait_minutes,
                    allocated_charger_code, queue_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.queue_code, item.zone_id, item.vehicle_plate,
                item.requested_kwh, item.battery_target_soc_pct,
                item.queue_position, item.estimated_wait_minutes,
                item.allocated_charger_code, item.queue_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return item

EVQueueRepository.init_table()
