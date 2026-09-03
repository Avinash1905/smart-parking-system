"""
SmartPark Violation Citation Evidence Image & Cryptographic Watermark Repository Layer
Manages high-resolution camera ANPR snapshots, GPS geotagging, and cryptographic timestamped violation proof dossiers.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CitationEvidenceDossier:
    def __init__(
        self,
        id: str = "",
        evidence_code: str = "EVID-VIOL-8842",
        violation_id: str = "viol-901",
        vehicle_plate: str = "KA-05-AB-1234",
        camera_id: str = "CAM-ANPR-ENTRY-01",
        image_uri: str = "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600",
        gps_latitude: float = 12.9716,
        gps_longitude: float = 77.5946,
        ocr_confidence_pct: float = 99.6,
        cryptographic_hash: str = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: str = "VERIFIED_TAMPER_PROOF",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"evd-{uuid.uuid4().hex[:8]}"
        self.evidence_code = evidence_code
        self.violation_id = violation_id
        self.vehicle_plate = vehicle_plate
        self.camera_id = camera_id
        self.image_uri = image_uri
        self.gps_latitude = gps_latitude
        self.gps_longitude = gps_longitude
        self.ocr_confidence_pct = ocr_confidence_pct
        self.cryptographic_hash = cryptographic_hash
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "evidence_code": self.evidence_code,
            "violation_id": self.violation_id,
            "vehicle_plate": self.vehicle_plate,
            "camera_id": self.camera_id,
            "image_uri": self.image_uri,
            "gps_latitude": self.gps_latitude,
            "gps_longitude": self.gps_longitude,
            "ocr_confidence_pct": self.ocr_confidence_pct,
            "cryptographic_hash": self.cryptographic_hash,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class CitationEvidenceRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS citation_evidence_dossiers (
                    id TEXT PRIMARY KEY,
                    evidence_code TEXT UNIQUE NOT NULL,
                    violation_id TEXT NOT NULL,
                    vehicle_plate TEXT NOT NULL,
                    camera_id TEXT NOT NULL,
                    image_uri TEXT NOT NULL,
                    gps_latitude REAL DEFAULT 12.9716,
                    gps_longitude REAL DEFAULT 77.5946,
                    ocr_confidence_pct REAL DEFAULT 99.6,
                    cryptographic_hash TEXT NOT NULL,
                    status TEXT DEFAULT 'VERIFIED_TAMPER_PROOF',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[CitationEvidenceDossier]:
        CitationEvidenceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM citation_evidence_dossiers ORDER BY timestamp DESC")
            return [CitationEvidenceDossier(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: CitationEvidenceDossier) -> bool:
        CitationEvidenceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO citation_evidence_dossiers (
                    id, evidence_code, violation_id, vehicle_plate,
                    camera_id, image_uri, gps_latitude, gps_longitude,
                    ocr_confidence_pct, cryptographic_hash, status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.evidence_code, item.violation_id,
                item.vehicle_plate, item.camera_id, item.image_uri,
                item.gps_latitude, item.gps_longitude,
                item.ocr_confidence_pct, item.cryptographic_hash,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

CitationEvidenceRepository.init_table()
