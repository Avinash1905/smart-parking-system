"""
SmartPark Dynamic Axle Load & Weigh-in-Motion (WIM) Repository Layer
Manages quartz piezo-electric weigh-in-motion sensors, gross vehicle weight (GVW) enforcement, structural load limit protection, and heavy vehicle axle alarms.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AxleLoadNode:
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "WIM-AXLE-SENSOR-01",
        zone_id: str = "zone-pub-01",
        ingress_lane: str = "Main Ingress Portal Lane 1",
        vehicle_plate: str = "KA-01-MJ-5890",
        measured_gross_weight_kg: float = 2140.0,
        max_allowable_deck_weight_kg: float = 3500.0,
        axle_count: int = 2,
        overweight_alarm_triggered: bool = False,
        wim_status: str = "AXLE_LOAD_CLEARED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"wim-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.ingress_lane = ingress_lane
        self.vehicle_plate = vehicle_plate
        self.measured_gross_weight_kg = measured_gross_weight_kg
        self.max_allowable_deck_weight_kg = max_allowable_deck_weight_kg
        self.axle_count = axle_count
        self.overweight_alarm_triggered = overweight_alarm_triggered
        self.wim_status = wim_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sensor_code": self.sensor_code,
            "zone_id": self.zone_id,
            "ingress_lane": self.ingress_lane,
            "vehicle_plate": self.vehicle_plate,
            "measured_gross_weight_kg": self.measured_gross_weight_kg,
            "max_allowable_deck_weight_kg": self.max_allowable_deck_weight_kg,
            "axle_count": self.axle_count,
            "overweight_alarm_triggered": self.overweight_alarm_triggered,
            "wim_status": self.wim_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class AxleLoadRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS axle_load_nodes (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    ingress_lane TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    measured_gross_weight_kg REAL DEFAULT 2140.0,
                    max_allowable_deck_weight_kg REAL DEFAULT 3500.0,
                    axle_count INTEGER DEFAULT 2,
                    overweight_alarm_triggered INTEGER DEFAULT 0,
                    wim_status TEXT DEFAULT 'AXLE_LOAD_CLEARED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> AxleLoadNode:
        AxleLoadRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM axle_load_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["overweight_alarm_triggered"] = bool(d["overweight_alarm_triggered"])
                return AxleLoadNode(**d)
            node = AxleLoadNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO axle_load_nodes (
                    id, sensor_code, zone_id, ingress_lane,
                    vehicle_plate, measured_gross_weight_kg,
                    max_allowable_deck_weight_kg, axle_count,
                    overweight_alarm_triggered, wim_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.sensor_code, node.zone_id,
                node.ingress_lane, node.vehicle_plate,
                node.measured_gross_weight_kg,
                node.max_allowable_deck_weight_kg,
                node.axle_count,
                1 if node.overweight_alarm_triggered else 0,
                node.wim_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

AxleLoadRepository.init_table()
