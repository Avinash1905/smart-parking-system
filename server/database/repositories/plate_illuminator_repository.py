"""
SmartPark ANPR Camera Infrared Strobe & Optical Heated De-Icer Illuminator Repository Layer
Manages 850nm pulsed IR strobe illuminators, heated optical glass anti-fog de-icers, and cross-polarized anti-glare filters for 100% license plate capture.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PlateIlluminatorNode:
    def __init__(
        self,
        id: str = "",
        unit_code: str = "ANPR-ILLUMINATOR-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Main Inbound Gate Portal",
        infrared_wavelength_nm: int = 850,
        strobe_pulse_duration_us: int = 150,
        optical_glass_heater_temp_celsius: float = 28.5,
        license_plate_read_accuracy_pct: float = 99.96,
        polarization_filter_active: bool = True,
        illuminator_state: str = "PULSED_STROBE_OPTIMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"pin-{uuid.uuid4().hex[:8]}"
        self.unit_code = unit_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.infrared_wavelength_nm = infrared_wavelength_nm
        self.strobe_pulse_duration_us = strobe_pulse_duration_us
        self.optical_glass_heater_temp_celsius = optical_glass_heater_temp_celsius
        self.license_plate_read_accuracy_pct = license_plate_read_accuracy_pct
        self.polarization_filter_active = polarization_filter_active
        self.illuminator_state = illuminator_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "unit_code": self.unit_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "infrared_wavelength_nm": self.infrared_wavelength_nm,
            "strobe_pulse_duration_us": self.strobe_pulse_duration_us,
            "optical_glass_heater_temp_celsius": self.optical_glass_heater_temp_celsius,
            "license_plate_read_accuracy_pct": self.license_plate_read_accuracy_pct,
            "polarization_filter_active": self.polarization_filter_active,
            "illuminator_state": self.illuminator_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class PlateIlluminatorRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS plate_illuminator_nodes (
                    id TEXT PRIMARY KEY,
                    unit_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    infrared_wavelength_nm INTEGER DEFAULT 850,
                    strobe_pulse_duration_us INTEGER DEFAULT 150,
                    optical_glass_heater_temp_celsius REAL DEFAULT 28.5,
                    license_plate_read_accuracy_pct REAL DEFAULT 99.96,
                    polarization_filter_active INTEGER DEFAULT 1,
                    illuminator_state TEXT DEFAULT 'PULSED_STROBE_OPTIMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> PlateIlluminatorNode:
        PlateIlluminatorRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM plate_illuminator_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["polarization_filter_active"] = bool(d["polarization_filter_active"])
                return PlateIlluminatorNode(**d)
            node = PlateIlluminatorNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO plate_illuminator_nodes (
                    id, unit_code, zone_id, floor_level,
                    infrared_wavelength_nm, strobe_pulse_duration_us,
                    optical_glass_heater_temp_celsius,
                    license_plate_read_accuracy_pct,
                    polarization_filter_active,
                    illuminator_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.unit_code, node.zone_id, node.floor_level,
                node.infrared_wavelength_nm,
                node.strobe_pulse_duration_us,
                node.optical_glass_heater_temp_celsius,
                node.license_plate_read_accuracy_pct,
                1 if node.polarization_filter_active else 0,
                node.illuminator_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

PlateIlluminatorRepository.init_table()
