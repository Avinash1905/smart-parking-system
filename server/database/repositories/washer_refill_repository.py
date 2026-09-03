"""
SmartPark Sub-Zero Windshield Washer Anti-Freeze Fluid Refill Reservoir Repository Layer
Manages 500-liter sub-zero -30°C winter de-icing fluid reservoirs, ultrasonic level depth sensors, trace heating loops, and automated nozzle dispensers.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class WasherRefillNode:
    def __init__(
        self,
        id: str = "",
        reservoir_code: str = "WASHER-REFILL-TANK-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Motorist Service Island",
        fluid_level_percentage: float = 88.5,
        total_capacity_liters: float = 500.0,
        subzero_freeze_protection_celsius: float = -30.0,
        heating_trace_wire_active: bool = True,
        refills_dispensed_today: int = 42,
        dispenser_valve_state: str = "DISPENSER_READY_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"wrn-{uuid.uuid4().hex[:8]}"
        self.reservoir_code = reservoir_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.fluid_level_percentage = fluid_level_percentage
        self.total_capacity_liters = total_capacity_liters
        self.subzero_freeze_protection_celsius = subzero_freeze_protection_celsius
        self.heating_trace_wire_active = heating_trace_wire_active
        self.refills_dispensed_today = refills_dispensed_today
        self.dispenser_valve_state = dispenser_valve_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "reservoir_code": self.reservoir_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "fluid_level_percentage": self.fluid_level_percentage,
            "total_capacity_liters": self.total_capacity_liters,
            "subzero_freeze_protection_celsius": self.subzero_freeze_protection_celsius,
            "heating_trace_wire_active": self.heating_trace_wire_active,
            "refills_dispensed_today": self.refills_dispensed_today,
            "dispenser_valve_state": self.dispenser_valve_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class WasherRefillRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS washer_refill_nodes (
                    id TEXT PRIMARY KEY,
                    reservoir_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    fluid_level_percentage REAL DEFAULT 88.5,
                    total_capacity_liters REAL DEFAULT 500.0,
                    subzero_freeze_protection_celsius REAL DEFAULT -30.0,
                    heating_trace_wire_active INTEGER DEFAULT 1,
                    refills_dispensed_today INTEGER DEFAULT 42,
                    dispenser_valve_state TEXT DEFAULT 'DISPENSER_READY_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> WasherRefillNode:
        WasherRefillRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM washer_refill_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["heating_trace_wire_active"] = bool(d["heating_trace_wire_active"])
                return WasherRefillNode(**d)
            node = WasherRefillNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO washer_refill_nodes (
                    id, reservoir_code, zone_id, floor_level,
                    fluid_level_percentage, total_capacity_liters,
                    subzero_freeze_protection_celsius,
                    heating_trace_wire_active,
                    refills_dispensed_today,
                    dispenser_valve_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.reservoir_code, node.zone_id, node.floor_level,
                node.fluid_level_percentage,
                node.total_capacity_liters,
                node.subzero_freeze_protection_celsius,
                1 if node.heating_trace_wire_active else 0,
                node.refills_dispensed_today,
                node.dispenser_valve_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

WasherRefillRepository.init_table()
