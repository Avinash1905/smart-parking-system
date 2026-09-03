"""
SmartPark EV Thermal Runaway & Battery Fire Suppression Repository Layer
Manages underbody high-pressure micro-water mist nozzles, thermal infrared hotspot cameras, and lithium fire quenching.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class EVThermalSuppressionZone:
    def __init__(
        self,
        id: str = "",
        zone_code: str = "EV-FIRE-BAY-A03",
        slot_code: str = "A-03",
        zone_id: str = "zone-pub-01",
        battery_pack_temp_celsius: float = 31.5,
        thermal_camera_hotspot_detected: bool = False,
        underbody_mist_pressure_bar: float = 140.0,
        nitrogen_inerting_ready: bool = True,
        suppression_system_state: str = "ARMED_MONITORING",  # ARMED_MONITORING | PRE_ALARM_HEATING | ACTIVE_DISCHARGE
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"evf-{uuid.uuid4().hex[:8]}"
        self.zone_code = zone_code
        self.slot_code = slot_code
        self.zone_id = zone_id
        self.battery_pack_temp_celsius = battery_pack_temp_celsius
        self.thermal_camera_hotspot_detected = thermal_camera_hotspot_detected
        self.underbody_mist_pressure_bar = underbody_mist_pressure_bar
        self.nitrogen_inerting_ready = nitrogen_inerting_ready
        self.suppression_system_state = suppression_system_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "zone_code": self.zone_code,
            "slot_code": self.slot_code,
            "zone_id": self.zone_id,
            "battery_pack_temp_celsius": self.battery_pack_temp_celsius,
            "thermal_camera_hotspot_detected": self.thermal_camera_hotspot_detected,
            "underbody_mist_pressure_bar": self.underbody_mist_pressure_bar,
            "nitrogen_inerting_ready": self.nitrogen_inerting_ready,
            "suppression_system_state": self.suppression_system_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class EVThermalSuppressionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ev_thermal_suppression_zones (
                    id TEXT PRIMARY KEY,
                    zone_code TEXT UNIQUE NOT NULL,
                    slot_code TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    battery_pack_temp_celsius REAL DEFAULT 31.5,
                    thermal_camera_hotspot_detected INTEGER DEFAULT 0,
                    underbody_mist_pressure_bar REAL DEFAULT 140.0,
                    nitrogen_inerting_ready INTEGER DEFAULT 1,
                    suppression_system_state TEXT DEFAULT 'ARMED_MONITORING',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_by_zone(zone_id: str = "zone-pub-01") -> List[EVThermalSuppressionZone]:
        EVThermalSuppressionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ev_thermal_suppression_zones WHERE zone_id = ? ORDER BY slot_code ASC", (zone_id,))
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["thermal_camera_hotspot_detected"] = bool(d["thermal_camera_hotspot_detected"])
                d["nitrogen_inerting_ready"] = bool(d["nitrogen_inerting_ready"])
                res.append(EVThermalSuppressionZone(**d))
            return res

    @staticmethod
    def create(item: EVThermalSuppressionZone) -> bool:
        EVThermalSuppressionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO ev_thermal_suppression_zones (
                    id, zone_code, slot_code, zone_id,
                    battery_pack_temp_celsius,
                    thermal_camera_hotspot_detected,
                    underbody_mist_pressure_bar,
                    nitrogen_inerting_ready,
                    suppression_system_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.zone_code, item.slot_code, item.zone_id,
                item.battery_pack_temp_celsius,
                1 if item.thermal_camera_hotspot_detected else 0,
                item.underbody_mist_pressure_bar,
                1 if item.nitrogen_inerting_ready else 0,
                item.suppression_system_state, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

EVThermalSuppressionRepository.init_table()
