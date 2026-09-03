"""
SmartPark Weigh-In-Motion (WIM) In-Ground Axle Load Limiter Repository Layer
Manages piezoelectric quartz load sensors measuring vehicle gross weight (metric tons) to prevent overloading multi-deck concrete structures.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AxleWeightRecord:
    def __init__(
        self,
        id: str = "",
        scale_code: str = "WIM-SCALE-ENTRY-01",
        vehicle_plate: str = "KA-01-MJ-5890",
        zone_id: str = "zone-pub-01",
        front_axle_weight_kg: float = 920.0,
        rear_axle_weight_kg: float = 880.0,
        gross_vehicle_weight_tons: float = 1.80,
        deck_max_rated_limit_tons: float = 3.50,
        structural_weight_verdict: str = "SAFE_WITHIN_LIMITS",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"axl-{uuid.uuid4().hex[:8]}"
        self.scale_code = scale_code
        self.vehicle_plate = vehicle_plate
        self.zone_id = zone_id
        self.front_axle_weight_kg = front_axle_weight_kg
        self.rear_axle_weight_kg = rear_axle_weight_kg
        self.gross_vehicle_weight_tons = gross_vehicle_weight_tons
        self.deck_max_rated_limit_tons = deck_max_rated_limit_tons
        self.structural_weight_verdict = structural_weight_verdict
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "scale_code": self.scale_code,
            "vehicle_plate": self.vehicle_plate,
            "zone_id": self.zone_id,
            "front_axle_weight_kg": self.front_axle_weight_kg,
            "rear_axle_weight_kg": self.rear_axle_weight_kg,
            "gross_vehicle_weight_tons": self.gross_vehicle_weight_tons,
            "deck_max_rated_limit_tons": self.deck_max_rated_limit_tons,
            "structural_weight_verdict": self.structural_weight_verdict,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class AxleWeightRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS axle_weight_records (
                    id TEXT PRIMARY KEY,
                    scale_code TEXT UNIQUE NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    front_axle_weight_kg REAL DEFAULT 920.0,
                    rear_axle_weight_kg REAL DEFAULT 880.0,
                    gross_vehicle_weight_tons REAL DEFAULT 1.80,
                    deck_max_rated_limit_tons REAL DEFAULT 3.50,
                    structural_weight_verdict TEXT DEFAULT 'SAFE_WITHIN_LIMITS',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(plate: str = "KA-01-MJ-5890") -> AxleWeightRecord:
        AxleWeightRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM axle_weight_records WHERE UPPER(vehicle_plate) = ? ORDER BY timestamp DESC LIMIT 1", (plate.upper().strip(),))
            row = cursor.fetchone()
            if row:
                return AxleWeightRecord(**dict(row))
            rec = AxleWeightRecord(vehicle_plate=plate)
            cursor.execute("""
                INSERT INTO axle_weight_records (
                    id, scale_code, vehicle_plate, zone_id,
                    front_axle_weight_kg, rear_axle_weight_kg,
                    gross_vehicle_weight_tons,
                    deck_max_rated_limit_tons,
                    structural_weight_verdict, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                rec.id, rec.scale_code, rec.vehicle_plate, rec.zone_id,
                rec.front_axle_weight_kg, rec.rear_axle_weight_kg,
                rec.gross_vehicle_weight_tons,
                rec.deck_max_rated_limit_tons,
                rec.structural_weight_verdict,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return rec

AxleWeightRepository.init_table()
