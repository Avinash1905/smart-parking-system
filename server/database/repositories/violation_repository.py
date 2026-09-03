"""
SmartPark Violations Repository Layer
Handles infraction recording, status transitions, evidence aggregation, and fine calculations.
"""

import sqlite3
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import ParkingViolation

class ViolationRepository:
    @staticmethod
    def get_by_id(violation_id: str) -> Optional[ParkingViolation]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM parking_violations WHERE id = ?", (violation_id,))
            row = cursor.fetchone()
            return ParkingViolation.from_dict(dict(row)) if row else None

    @staticmethod
    def list_all(status: Optional[str] = None, zone_id: Optional[str] = None, limit: int = 100) -> List[ParkingViolation]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM parking_violations WHERE 1=1"
            params = []
            if status and status != "ALL":
                query += " AND status = ?"
                params.append(status)
            if zone_id:
                query += " AND parking_zone_id = ?"
                params.append(zone_id)
            query += " ORDER BY date_time DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            return [ParkingViolation.from_dict(dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def list_by_vehicle(vehicle_plate: str) -> List[ParkingViolation]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM parking_violations WHERE vehicle_plate = ? ORDER BY date_time DESC", (vehicle_plate.upper().strip(),))
            return [ParkingViolation.from_dict(dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(v: ParkingViolation) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO parking_violations (
                    id, vehicle_plate, user_id, user_name, user_email, parking_zone_id,
                    parking_zone_name, slot_number, violation_type, severity, fine_amount,
                    date_time, status, description, evidence_notes, image_evidence_url,
                    resolved_by_admin_id, resolution_notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                v.id, v.vehicle_plate, v.user_id, v.user_name, v.user_email,
                v.parking_zone_id, v.parking_zone_name, v.slot_number,
                v.violation_type, v.severity, v.fine_amount,
                v.date_time.isoformat() if isinstance(v.date_time, datetime) else v.date_time,
                v.status, v.description, v.evidence_notes, v.image_evidence_url,
                v.resolved_by_admin_id, v.resolution_notes
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def update_status(violation_id: str, new_status: str, admin_id: str, notes: Optional[str] = None) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE parking_violations 
                SET status = ?, resolved_by_admin_id = ?, resolution_notes = ?
                WHERE id = ?
            """, (new_status, admin_id, notes or f"Status set to {new_status}", violation_id))
            conn.commit()
            return cursor.rowcount > 0
