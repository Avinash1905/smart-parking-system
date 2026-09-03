"""
SmartPark Under-Vehicle Inspection (UVSS) 3D LiDAR Threat Profiler Repository Layer
Manages high-speed in-ground 3D LiDAR line-scanners creating sub-millimeter undercarriage point clouds to detect contraband, magnetic trackers, and frame damage.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class UVSSLidarNode:
    def __init__(
        self,
        id: str = "",
        scanner_code: str = "UVSS-3D-LIDAR-GATE-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Main Security Inbound Gate",
        vehicle_plate: str = "KA-01-EQ-9988",
        lidar_point_cloud_density_pts: int = 450000,
        anomalous_foreign_objects_detected: int = 0,
        ground_clearance_lowest_point_cm: float = 16.5,
        scan_processing_latency_ms: int = 145,
        security_clearance_status: str = "UNDERBODY_CLEARED_SECURITY_PASSED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"uvl-{uuid.uuid4().hex[:8]}"
        self.scanner_code = scanner_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.vehicle_plate = vehicle_plate
        self.lidar_point_cloud_density_pts = lidar_point_cloud_density_pts
        self.anomalous_foreign_objects_detected = anomalous_foreign_objects_detected
        self.ground_clearance_lowest_point_cm = ground_clearance_lowest_point_cm
        self.scan_processing_latency_ms = scan_processing_latency_ms
        self.security_clearance_status = security_clearance_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "scanner_code": self.scanner_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "vehicle_plate": self.vehicle_plate,
            "lidar_point_cloud_density_pts": self.lidar_point_cloud_density_pts,
            "anomalous_foreign_objects_detected": self.anomalous_foreign_objects_detected,
            "ground_clearance_lowest_point_cm": self.ground_clearance_lowest_point_cm,
            "scan_processing_latency_ms": self.scan_processing_latency_ms,
            "security_clearance_status": self.security_clearance_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class UVSSLidarRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS uvss_lidar_nodes (
                    id TEXT PRIMARY KEY,
                    scanner_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    lidar_point_cloud_density_pts INTEGER DEFAULT 450000,
                    anomalous_foreign_objects_detected INTEGER DEFAULT 0,
                    ground_clearance_lowest_point_cm REAL DEFAULT 16.5,
                    scan_processing_latency_ms INTEGER DEFAULT 145,
                    security_clearance_status TEXT DEFAULT 'UNDERBODY_CLEARED_SECURITY_PASSED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> UVSSLidarNode:
        UVSSLidarRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM uvss_lidar_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return UVSSLidarNode(**dict(row))
            node = UVSSLidarNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO uvss_lidar_nodes (
                    id, scanner_code, zone_id, floor_level,
                    vehicle_plate, lidar_point_cloud_density_pts,
                    anomalous_foreign_objects_detected,
                    ground_clearance_lowest_point_cm,
                    scan_processing_latency_ms,
                    security_clearance_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.scanner_code, node.zone_id, node.floor_level,
                node.vehicle_plate, node.lidar_point_cloud_density_pts,
                node.anomalous_foreign_objects_detected,
                node.ground_clearance_lowest_point_cm,
                node.scan_processing_latency_ms,
                node.security_clearance_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

UVSSLidarRepository.init_table()
