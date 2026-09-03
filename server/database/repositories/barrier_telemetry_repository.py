"""
SmartPark Boom Barrier Watchdog & Motor Health Repository Layer
Tracks barrier solenoid cycle counts, optical safety loop sensors, motor coil temperature, and auto-reboot watchdogs.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BarrierTelemetryNode:
    def __init__(
        self,
        id: str = "",
        gate_code: str = "GATE-NORTH-BARRIER-01",
        zone_id: str = "zone-pub-01",
        total_open_cycles: int = 14820,
        motor_temp_celsius: float = 38.4,
        solenoid_response_time_ms: int = 140,
        optical_safety_loop_clear: bool = True,
        watchdog_reboot_status: str = "HEALTHY_ONLINE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"gate-{uuid.uuid4().hex[:8]}"
        self.gate_code = gate_code
        self.zone_id = zone_id
        self.total_open_cycles = total_open_cycles
        self.motor_temp_celsius = motor_temp_celsius
        self.solenoid_response_time_ms = solenoid_response_time_ms
        self.optical_safety_loop_clear = optical_safety_loop_clear
        self.watchdog_reboot_status = watchdog_reboot_status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "gate_code": self.gate_code,
            "zone_id": self.zone_id,
            "total_open_cycles": self.total_open_cycles,
            "motor_temp_celsius": self.motor_temp_celsius,
            "solenoid_response_time_ms": self.solenoid_response_time_ms,
            "optical_safety_loop_clear": self.optical_safety_loop_clear,
            "watchdog_reboot_status": self.watchdog_reboot_status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class BarrierTelemetryRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS barrier_telemetry_nodes (
                    id TEXT PRIMARY KEY,
                    gate_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    total_open_cycles INTEGER DEFAULT 14820,
                    motor_temp_celsius REAL DEFAULT 38.4,
                    solenoid_response_time_ms INTEGER DEFAULT 140,
                    optical_safety_loop_clear INTEGER DEFAULT 1,
                    watchdog_reboot_status TEXT DEFAULT 'HEALTHY_ONLINE',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[BarrierTelemetryNode]:
        BarrierTelemetryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM barrier_telemetry_nodes ORDER BY gate_code ASC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["optical_safety_loop_clear"] = bool(d["optical_safety_loop_clear"])
                res.append(BarrierTelemetryNode(**d))
            return res

    @staticmethod
    def create(node: BarrierTelemetryNode) -> bool:
        BarrierTelemetryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO barrier_telemetry_nodes (
                    id, gate_code, zone_id, total_open_cycles,
                    motor_temp_celsius, solenoid_response_time_ms,
                    optical_safety_loop_clear, watchdog_reboot_status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.gate_code, node.zone_id, node.total_open_cycles,
                node.motor_temp_celsius, node.solenoid_response_time_ms,
                1 if node.optical_safety_loop_clear else 0,
                node.watchdog_reboot_status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

BarrierTelemetryRepository.init_table()
