"""
SmartPark Parking Slot & Bay Repository Layer
Manages bay allocation matrix, floor levels, EV status, and slot lockouts.
"""

import sqlite3
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import ParkingSlot

class ParkingSlotRepository:
    @staticmethod
    def get_by_id(slot_id: str) -> Optional[ParkingSlot]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM parking_slots WHERE id = ?", (slot_id,))
            row = cursor.fetchone()
            return ParkingSlot.from_dict(dict(row)) if row else None

    @staticmethod
    def list_by_zone(zone_id: str, floor_level: Optional[str] = None, status: Optional[str] = None) -> List[ParkingSlot]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM parking_slots WHERE zone_id = ?"
            params = [zone_id]
            if floor_level:
                query += " AND floor_level = ?"
                params.append(floor_level)
            if status:
                query += " AND status = ?"
                params.append(status)
            query += " ORDER BY slot_number ASC"

            cursor.execute(query, params)
            return [ParkingSlot.from_dict(dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def find_available_slot(zone_id: str, require_ev: bool = False) -> Optional[ParkingSlot]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM parking_slots WHERE zone_id = ? AND status = 'AVAILABLE'"
            params = [zone_id]
            if require_ev:
                query += " AND slot_type = 'EV_FAST_CHARGE'"
            query += " ORDER BY slot_number ASC LIMIT 1"

            cursor.execute(query, params)
            row = cursor.fetchone()
            return ParkingSlot.from_dict(dict(row)) if row else None

    @staticmethod
    def set_slot_status(slot_id: str, new_status: str, vehicle_plate: Optional[str] = None, reservation_id: Optional[str] = None) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                UPDATE parking_slots 
                SET status = ?, current_vehicle_plate = ?, current_reservation_id = ?, last_status_change = ?
                WHERE id = ?
            """, (new_status, vehicle_plate, reservation_id, now_iso, slot_id))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def release_reservation_slots(reservation_id: str) -> int:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                UPDATE parking_slots 
                SET status = 'AVAILABLE', current_reservation_id = NULL, current_vehicle_plate = NULL, last_status_change = ?
                WHERE current_reservation_id = ?
            """, (now_iso, reservation_id))
            conn.commit()
            return cursor.rowcount
