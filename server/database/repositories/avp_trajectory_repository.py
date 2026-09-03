"""
SmartPark Autonomous Valet Parking (AVP Level 4) Trajectory Repository Layer
Manages high-definition vector map waypoints, spline path generation, and millimetric autonomous parking maneuvers.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AVPTrajectoryMission:
    def __init__(
        self,
        id: str = "",
        mission_code: str = "AVP-MIS-4820",
        vehicle_plate: str = "KA-01-EQ-9988",
        dropoff_bay: str = "VALET-DROP-01",
        target_parking_stall: str = "B2-DEEP-44",
        total_waypoints_count: int = 48,
        trajectory_length_meters: float = 184.5,
        lidar_localization_confidence_pct: float = 99.8,
        mission_status: str = "AUTONOMOUS_TRANSIT_IN_PROGRESS",  # AUTONOMOUS_TRANSIT_IN_PROGRESS | PARKED_SUCCESS | MISSION_ABORT
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"avp-{uuid.uuid4().hex[:8]}"
        self.mission_code = mission_code
        self.vehicle_plate = vehicle_plate
        self.dropoff_bay = dropoff_bay
        self.target_parking_stall = target_parking_stall
        self.total_waypoints_count = total_waypoints_count
        self.trajectory_length_meters = trajectory_length_meters
        self.lidar_localization_confidence_pct = lidar_localization_confidence_pct
        self.mission_status = mission_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "mission_code": self.mission_code,
            "vehicle_plate": self.vehicle_plate,
            "dropoff_bay": self.dropoff_bay,
            "target_parking_stall": self.target_parking_stall,
            "total_waypoints_count": self.total_waypoints_count,
            "trajectory_length_meters": self.trajectory_length_meters,
            "lidar_localization_confidence_pct": self.lidar_localization_confidence_pct,
            "mission_status": self.mission_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class AVPTrajectoryRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS avp_trajectories (
                    id TEXT PRIMARY KEY,
                    mission_code TEXT UNIQUE NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    dropoff_bay TEXT NOT NULL,
                    target_parking_stall TEXT NOT NULL,
                    total_waypoints_count INTEGER DEFAULT 48,
                    trajectory_length_meters REAL DEFAULT 184.5,
                    lidar_localization_confidence_pct REAL DEFAULT 99.8,
                    mission_status TEXT DEFAULT 'AUTONOMOUS_TRANSIT_IN_PROGRESS',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[AVPTrajectoryMission]:
        AVPTrajectoryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM avp_trajectories ORDER BY timestamp DESC")
            return [AVPTrajectoryMission(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: AVPTrajectoryMission) -> bool:
        AVPTrajectoryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO avp_trajectories (
                    id, mission_code, vehicle_plate, dropoff_bay,
                    target_parking_stall, total_waypoints_count,
                    trajectory_length_meters,
                    lidar_localization_confidence_pct,
                    mission_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.mission_code, item.vehicle_plate,
                item.dropoff_bay, item.target_parking_stall,
                item.total_waypoints_count, item.trajectory_length_meters,
                item.lidar_localization_confidence_pct,
                item.mission_status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

AVPTrajectoryRepository.init_table()
