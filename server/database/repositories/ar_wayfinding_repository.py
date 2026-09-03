"""
SmartPark Augmented Reality (AR) Pedestrian Wayfinding Repository Layer
Manages indoor BLE beacon RSSI anchors, floor turn-by-turn path waypoints, and AR camera chevron overlays to find parked vehicles.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ARWayfindingRoute:
    def __init__(
        self,
        id: str = "",
        route_code: str = "AR-NAV-PATH-7712",
        vehicle_plate: str = "KA-05-MN-9921",
        target_slot_code: str = "B2-44",
        current_pedestrian_location: str = "Elevator Core North (Floor B2)",
        total_walking_distance_meters: float = 64.5,
        estimated_walking_time_seconds: int = 48,
        total_waypoints_count: int = 6,
        status: str = "AR_NAVIGATION_ACTIVE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"arw-{uuid.uuid4().hex[:8]}"
        self.route_code = route_code
        self.vehicle_plate = vehicle_plate
        self.target_slot_code = target_slot_code
        self.current_pedestrian_location = current_pedestrian_location
        self.total_walking_distance_meters = total_walking_distance_meters
        self.estimated_walking_time_seconds = estimated_walking_time_seconds
        self.total_waypoints_count = total_waypoints_count
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "route_code": self.route_code,
            "vehicle_plate": self.vehicle_plate,
            "target_slot_code": self.target_slot_code,
            "current_pedestrian_location": self.current_pedestrian_location,
            "total_walking_distance_meters": self.total_walking_distance_meters,
            "estimated_walking_time_seconds": self.estimated_walking_time_seconds,
            "total_waypoints_count": self.total_waypoints_count,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ARWayfindingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ar_wayfinding_routes (
                    id TEXT PRIMARY KEY,
                    route_code TEXT UNIQUE NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    target_slot_code TEXT NOT NULL,
                    current_pedestrian_location TEXT NOT NULL,
                    total_walking_distance_meters REAL DEFAULT 64.5,
                    estimated_walking_time_seconds INTEGER DEFAULT 48,
                    total_waypoints_count INTEGER DEFAULT 6,
                    status TEXT DEFAULT 'AR_NAVIGATION_ACTIVE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_route(plate: str = "KA-05-MN-9921") -> ARWayfindingRoute:
        ARWayfindingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ar_wayfinding_routes WHERE UPPER(vehicle_plate) = ? ORDER BY timestamp DESC LIMIT 1", (plate.upper().strip(),))
            row = cursor.fetchone()
            if row:
                return ARWayfindingRoute(**dict(row))
            route = ARWayfindingRoute(vehicle_plate=plate)
            cursor.execute("""
                INSERT INTO ar_wayfinding_routes (
                    id, route_code, vehicle_plate, target_slot_code,
                    current_pedestrian_location,
                    total_walking_distance_meters,
                    estimated_walking_time_seconds,
                    total_waypoints_count, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                route.id, route.route_code, route.vehicle_plate,
                route.target_slot_code,
                route.current_pedestrian_location,
                route.total_walking_distance_meters,
                route.estimated_walking_time_seconds,
                route.total_waypoints_count, route.status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return route

ARWayfindingRepository.init_table()
