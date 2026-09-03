"""
SmartPark IoT Sensor Firmware Over-The-Air (OTA) Distribution Repository Layer
Manages mesh binary distribution, CRC32 checksums, and firmware rollouts across 1000+ ultrasonic bay sensors.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SensorOTARollout:
    def __init__(
        self,
        id: str = "",
        firmware_version: str = "v3.4.2-STABLE",
        release_notes: str = "Improved ultrasonic beam filtering in high humidity; 15% lower sleep current.",
        crc32_checksum: str = "0x8F4A19B2",
        total_target_nodes: int = 420,
        nodes_updated_count: int = 412,
        nodes_failed_count: int = 0,
        rollout_progress_pct: float = 98.1,
        status: str = "ROLLOUT_IN_PROGRESS",  # ROLLOUT_IN_PROGRESS | COMPLETED_VERIFIED | ROLLBACK_TRIGGERED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"ota-{uuid.uuid4().hex[:8]}"
        self.firmware_version = firmware_version
        self.release_notes = release_notes
        self.crc32_checksum = crc32_checksum
        self.total_target_nodes = total_target_nodes
        self.nodes_updated_count = nodes_updated_count
        self.nodes_failed_count = nodes_failed_count
        self.rollout_progress_pct = rollout_progress_pct
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "firmware_version": self.firmware_version,
            "release_notes": self.release_notes,
            "crc32_checksum": self.crc32_checksum,
            "total_target_nodes": self.total_target_nodes,
            "nodes_updated_count": self.nodes_updated_count,
            "nodes_failed_count": self.nodes_failed_count,
            "rollout_progress_pct": self.rollout_progress_pct,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class SensorOTARepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sensor_ota_rollouts (
                    id TEXT PRIMARY KEY,
                    firmware_version TEXT UNIQUE NOT NULL,
                    release_notes TEXT NOT NULL,
                    crc32_checksum TEXT NOT NULL,
                    total_target_nodes INTEGER DEFAULT 420,
                    nodes_updated_count INTEGER DEFAULT 412,
                    nodes_failed_count INTEGER DEFAULT 0,
                    rollout_progress_pct REAL DEFAULT 98.1,
                    status TEXT DEFAULT 'ROLLOUT_IN_PROGRESS',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest() -> SensorOTARollout:
        SensorOTARepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sensor_ota_rollouts ORDER BY created_at DESC LIMIT 1")
            row = cursor.fetchone()
            if row:
                return SensorOTARollout(**dict(row))
            ota = SensorOTARollout()
            cursor.execute("""
                INSERT INTO sensor_ota_rollouts (
                    id, firmware_version, release_notes, crc32_checksum,
                    total_target_nodes, nodes_updated_count,
                    nodes_failed_count, rollout_progress_pct, status,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ota.id, ota.firmware_version, ota.release_notes,
                ota.crc32_checksum, ota.total_target_nodes,
                ota.nodes_updated_count, ota.nodes_failed_count,
                ota.rollout_progress_pct, ota.status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return ota

SensorOTARepository.init_table()
