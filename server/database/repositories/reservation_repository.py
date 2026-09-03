"""
SmartPark Reservation & Booking Repository Layer
Manages booking creation, check-ins, check-outs, and expiration lifecycle.
"""

import sqlite3
import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import Reservation, ParkingPass

class ReservationRepository:
    @staticmethod
    def get_by_id(reservation_id: str) -> Optional[Reservation]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM reservations WHERE id = ?", (reservation_id,))
            row = cursor.fetchone()
            return Reservation.from_dict(dict(row)) if row else None

    @staticmethod
    def get_by_pass_token(token: str) -> Optional[Reservation]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM reservations WHERE qr_pass_token = ?", (token,))
            row = cursor.fetchone()
            return Reservation.from_dict(dict(row)) if row else None

    @staticmethod
    def list_by_user(user_id: str, status: Optional[str] = None, limit: int = 50) -> List[Reservation]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM reservations WHERE user_id = ?"
            params = [user_id]
            if status:
                query += " AND status = ?"
                params.append(status)
            query += " ORDER BY created_at DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            return [Reservation.from_dict(dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def list_all(status: Optional[str] = None, zone_id: Optional[str] = None, limit: int = 100) -> List[Reservation]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM reservations WHERE 1=1"
            params = []
            if status:
                query += " AND status = ?"
                params.append(status)
            if zone_id:
                query += " AND parking_zone_id = ?"
                params.append(zone_id)
            query += " ORDER BY created_at DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            return [Reservation.from_dict(dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(res: Reservation) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO reservations (
                    id, user_id, user_name, user_email, parking_zone_id, parking_zone_name,
                    slot_id, slot_number, vehicle_id, vehicle_plate, vehicle_type,
                    start_time, end_time, duration_hours, hourly_rate, total_amount,
                    payment_status, status, qr_pass_token, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                res.id, res.user_id, res.user_name, res.user_email, res.parking_zone_id,
                res.parking_zone_name, res.slot_id, res.slot_number, res.vehicle_id,
                res.vehicle_plate, res.vehicle_type,
                res.start_time.isoformat() if isinstance(res.start_time, datetime) else res.start_time,
                res.end_time.isoformat() if isinstance(res.end_time, datetime) else res.end_time,
                res.duration_hours, res.hourly_rate, res.total_amount, res.payment_status,
                res.status, res.qr_pass_token, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def perform_check_in(reservation_id: str) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                UPDATE reservations 
                SET status = 'CHECKED_IN', check_in_time = ?
                WHERE id = ? AND status = 'RESERVED'
            """, (now_iso, reservation_id))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def perform_check_out(reservation_id: str) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                UPDATE reservations 
                SET status = 'COMPLETED', check_out_time = ?
                WHERE id = ? AND status IN ('RESERVED', 'CHECKED_IN', 'ACTIVE')
            """, (now_iso, reservation_id))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def cancel_reservation(reservation_id: str) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE reservations 
                SET status = 'CANCELLED', payment_status = 'REFUNDED'
                WHERE id = ? AND status = 'RESERVED'
            """, (reservation_id,))
            conn.commit()
            return cursor.rowcount > 0
