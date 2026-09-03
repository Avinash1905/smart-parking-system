"""
SmartPark Emergency Vehicle Green Corridor & Siren Detection Repository Layer
Manages hospital ambulances, fire engines, acoustic siren triggers, and automated instant barrier clearance.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class EmergencyVehicleClearance:
    def __init__(
        self,
        id: str = "",
        vehicle_plate: str = "KA-01-AMB-108",
        agency_name: str = "Karnataka State Emergency Medical Services (108)",
        vehicle_type: str = "AMBULANCE",  # AMBULANCE | FIRE_RESCUE | POLICE_INTERCEPTOR
        approaching_gate_code: str = "GATE-NORTH-BARRIER-01",
        acoustic_siren_detected: bool = True,
        priority_lane_assigned: str = "EMERGENCY_CORRIDOR_LANE_1",
        gate_auto_lift_time_ms: int = 120,
        status: str = "CLEARED_PASSAGE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"emg-{uuid.uuid4().hex[:8]}"
        self.vehicle_plate = vehicle_plate
        self.agency_name = agency_name
        self.vehicle_type = vehicle_type
        self.approaching_gate_code = approaching_gate_code
        self.acoustic_siren_detected = acoustic_siren_detected
        self.priority_lane_assigned = priority_lane_assigned
        self.gate_auto_lift_time_ms = gate_auto_lift_time_ms
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "vehicle_plate": self.vehicle_plate,
            "agency_name": self.agency_name,
            "vehicle_type": self.vehicle_type,
            "approaching_gate_code": self.approaching_gate_code,
            "acoustic_siren_detected": self.acoustic_siren_detected,
            "priority_lane_assigned": self.priority_lane_assigned,
            "gate_auto_lift_time_ms": self.gate_auto_lift_time_ms,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class EmergencyVehicleRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS emergency_vehicle_clearances (
                    id TEXT PRIMARY KEY,
                    vehicle_plate TEXT NOT NULL,
                    agency_name TEXT NOT NULL,
                    vehicle_type TEXT DEFAULT 'AMBULANCE',
                    approaching_gate_code TEXT NOT NULL,
                    acoustic_siren_detected INTEGER DEFAULT 1,
                    priority_lane_assigned TEXT DEFAULT 'EMERGENCY_CORRIDOR_LANE_1',
                    gate_auto_lift_time_ms INTEGER DEFAULT 120,
                    status TEXT DEFAULT 'CLEARED_PASSAGE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(item: EmergencyVehicleClearance) -> bool:
        EmergencyVehicleRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO emergency_vehicle_clearances (
                    id, vehicle_plate, agency_name, vehicle_type,
                    approaching_gate_code, acoustic_siren_detected,
                    priority_lane_assigned, gate_auto_lift_time_ms,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.vehicle_plate, item.agency_name,
                item.vehicle_type, item.approaching_gate_code,
                1 if item.acoustic_siren_detected else 0,
                item.priority_lane_assigned, item.gate_auto_lift_time_ms,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_all() -> List[EmergencyVehicleClearance]:
        EmergencyVehicleRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM emergency_vehicle_clearances ORDER BY timestamp DESC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["acoustic_siren_detected"] = bool(d["acoustic_siren_detected"])
                res.append(EmergencyVehicleClearance(**d))
            return res

EmergencyVehicleRepository.init_table()
