"""
SmartPark Under-Vehicle Threat Inspection (UVSS) Repository Layer
Manages high-speed optical undercarriage line scans, foreign object detection, and high-security facility clearances.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class ThreatInspectionScan:
    def __init__(
        self,
        id: str = "",
        scan_code: str = "UVSS-SCAN-9901",
        vehicle_plate: str = "KA-01-MJ-5890",
        zone_id: str = "zone-pub-01",
        undercarriage_scan_image_uri: str = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600",
        foreign_object_detected: bool = False,
        threat_confidence_pct: float = 0.0,
        inspection_status: str = "CLEARED_SECURITY_PASSED",  # CLEARED_SECURITY_PASSED | THREAT_FLAGGED_ALARM | MANUAL_SEARCH_REQUIRED
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"uvs-{uuid.uuid4().hex[:8]}"
        self.scan_code = scan_code
        self.vehicle_plate = vehicle_plate
        self.zone_id = zone_id
        self.undercarriage_scan_image_uri = undercarriage_scan_image_uri
        self.foreign_object_detected = foreign_object_detected
        self.threat_confidence_pct = threat_confidence_pct
        self.inspection_status = inspection_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "scan_code": self.scan_code,
            "vehicle_plate": self.vehicle_plate,
            "zone_id": self.zone_id,
            "undercarriage_scan_image_uri": self.undercarriage_scan_image_uri,
            "foreign_object_detected": self.foreign_object_detected,
            "threat_confidence_pct": self.threat_confidence_pct,
            "inspection_status": self.inspection_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class ThreatInspectionRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS threat_inspection_scans (
                    id TEXT PRIMARY KEY,
                    scan_code TEXT UNIQUE NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    undercarriage_scan_image_uri TEXT NOT NULL,
                    foreign_object_detected INTEGER DEFAULT 0,
                    threat_confidence_pct REAL DEFAULT 0.0,
                    inspection_status TEXT DEFAULT 'CLEARED_SECURITY_PASSED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[ThreatInspectionScan]:
        ThreatInspectionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM threat_inspection_scans ORDER BY timestamp DESC")
            res = []
            for r in cursor.fetchall():
                d = dict(r)
                d["foreign_object_detected"] = bool(d["foreign_object_detected"])
                res.append(ThreatInspectionScan(**d))
            return res

    @staticmethod
    def create(item: ThreatInspectionScan) -> bool:
        ThreatInspectionRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO threat_inspection_scans (
                    id, scan_code, vehicle_plate, zone_id,
                    undercarriage_scan_image_uri, foreign_object_detected,
                    threat_confidence_pct, inspection_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.scan_code, item.vehicle_plate, item.zone_id,
                item.undercarriage_scan_image_uri,
                1 if item.foreign_object_detected else 0,
                item.threat_confidence_pct, item.inspection_status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

ThreatInspectionRepository.init_table()
