"""
SmartPark Vehicle & Garage Repository Layer
Manages registered vehicles, EV capabilities, and default active vehicle selection.
"""

import sqlite3
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import Vehicle

class VehicleRepository:
    @staticmethod
    def get_by_id(vehicle_id: str) -> Optional[Vehicle]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM vehicles WHERE id = ?", (vehicle_id,))
            row = cursor.fetchone()
            if not row:
                return None
            d = dict(row)
            d["is_ev"] = bool(d["is_ev"])
            d["fast_charge_compatible"] = bool(d["fast_charge_compatible"])
            d["is_default"] = bool(d["is_default"])
            return Vehicle.from_dict(d)

    @staticmethod
    def list_by_user(user_id: str) -> List[Vehicle]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM vehicles WHERE user_id = ? ORDER BY is_default DESC, created_at DESC", (user_id,))
            vehicles = []
            for row in cursor.fetchall():
                d = dict(row)
                d["is_ev"] = bool(d["is_ev"])
                d["fast_charge_compatible"] = bool(d["fast_charge_compatible"])
                d["is_default"] = bool(d["is_default"])
                vehicles.append(Vehicle.from_dict(d))
            return vehicles

    @staticmethod
    def create(v: Vehicle) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            
            # If default, clear other defaults for this user
            if v.is_default:
                cursor.execute("UPDATE vehicles SET is_default = 0 WHERE user_id = ?", (v.user_id,))

            cursor.execute("""
                INSERT INTO vehicles (
                    id, user_id, registration_plate, vehicle_type, brand, model,
                    color, is_ev, fast_charge_compatible, is_default, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                v.id, v.user_id, v.registration_plate.upper().strip(), v.vehicle_type,
                v.brand, v.model, v.color, 1 if v.is_ev else 0,
                1 if v.fast_charge_compatible else 0, 1 if v.is_default else 0, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def set_default(user_id: str, vehicle_id: str) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE vehicles SET is_default = 0 WHERE user_id = ?", (user_id,))
            cursor.execute("UPDATE vehicles SET is_default = 1 WHERE id = ? AND user_id = ?", (vehicle_id, user_id))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def delete(user_id: str, vehicle_id: str) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM vehicles WHERE id = ? AND user_id = ?", (vehicle_id, user_id))
            conn.commit()
            return cursor.rowcount > 0
