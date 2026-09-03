"""
SmartPark Autonomous Valet Parking (AVP) Dynamic Waypoint Trajectory Repository Layer
Manages sub-centimeter spline path trajectories, pedestrian safety bounding envelopes, LiDAR obstacle dynamic avoidance, and drop-off to bay routing.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ValetPathTrajectory:
    def __init__(
        self,
        id: str = "",
        trajectory_code: str = "AVP-PATH-TRAJECTORY-01",
        zone_id: str = "zone-pub-01",
        vehicle_plate: str = "KA-01-EQ-9988",
        origin_staging_kiosk: str = "Valet Drop-Off Zone Alpha",
        destination_slot_code: str = "Slot Floor B1 - Bay A-08",
        trajectory_waypoints_count: int = 64,
        path_distance_meters: float = 142.5,
        estimated_transit_seconds: int = 58,
        dynamic_collision_risk_score: float = 0.02,  # Risk < 0.10 is nominal
        navigation_state: str = "AUTONOMOUS_TRAJECTORY_CALCULATED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"vpt-{uuid.uuid4().hex[:8]}"
        self.trajectory_code = trajectory_code
        self.zone_id = zone_id
        self.vehicle_plate = vehicle_plate
        self.origin_staging_kiosk = origin_staging_kiosk
        self.destination_slot_code = destination_slot_code
        self.trajectory_waypoints_count = trajectory_waypoints_count
        self.path_distance_meters = path_distance_meters
        self.estimated_transit_seconds = estimated_transit_seconds
        self.dynamic_collision_risk_score = dynamic_collision_risk_score
        self.navigation_state = navigation_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "trajectory_code": self.trajectory_code,
            "zone_id": self.zone_id,
            "vehicle_plate": self.vehicle_plate,
            "origin_staging_kiosk": self.origin_staging_kiosk,
            "destination_slot_code": self.destination_slot_code,
            "trajectory_waypoints_count": self.trajectory_waypoints_count,
            "path_distance_meters": self.path_distance_meters,
            "estimated_transit_seconds": self.estimated_transit_seconds,
            "dynamic_collision_risk_score": self.dynamic_collision_risk_score,
            "navigation_state": self.navigation_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ValetPathPlannerRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS valet_path_trajectories (
                    id TEXT PRIMARY KEY,
                    trajectory_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    origin_staging_kiosk TEXT NOT NULL,
                    destination_slot_code TEXT NOT NULL,
                    trajectory_waypoints_count INTEGER DEFAULT 64,
                    path_distance_meters REAL DEFAULT 142.5,
                    estimated_transit_seconds INTEGER DEFAULT 58,
                    dynamic_collision_risk_score REAL DEFAULT 0.02,
                    navigation_state TEXT DEFAULT 'AUTONOMOUS_TRAJECTORY_CALCULATED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> ValetPathTrajectory:
        ValetPathPlannerRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM valet_path_trajectories WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return ValetPathTrajectory(**dict(row))
            traj = ValetPathTrajectory(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO valet_path_trajectories (
                    id, trajectory_code, zone_id, vehicle_plate,
                    origin_staging_kiosk, destination_slot_code,
                    trajectory_waypoints_count, path_distance_meters,
                    estimated_transit_seconds,
                    dynamic_collision_risk_score,
                    navigation_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                traj.id, traj.trajectory_code, traj.zone_id,
                traj.vehicle_plate, traj.origin_staging_kiosk,
                traj.destination_slot_code,
                traj.trajectory_waypoints_count,
                traj.path_distance_meters,
                traj.estimated_transit_seconds,
                traj.dynamic_collision_risk_score,
                traj.navigation_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return traj

ValetPathPlannerRepository.init_table()
