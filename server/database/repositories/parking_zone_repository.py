"""
SmartPark Parking Zone Repository Layer
Provides data access operations, spatial filtering, and capacity aggregations.
"""

import sqlite3
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db
from server.models.schema import ParkingZone

class ParkingZoneRepository:
    @staticmethod
    def get_by_id(zone_id: str) -> Optional[ParkingZone]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM parking_zones WHERE id = ?", (zone_id,))
            row = cursor.fetchone()
            if not row:
                return None
            d = dict(row)
            d["allowed_companies"] = json.loads(d["allowed_companies"] or "[]")
            d["authorized_user_ids"] = json.loads(d["authorized_user_ids"] or "[]")
            return ParkingZone.from_dict(d)

    @staticmethod
    def list_all(category: Optional[str] = None, company_id: Optional[str] = None, active_only: bool = True) -> List[ParkingZone]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM parking_zones WHERE 1=1"
            params = []
            if active_only:
                query += " AND status = 'ACTIVE'"
            if category:
                query += " AND category = ?"
                params.append(category)
            if company_id:
                query += " AND company_id = ?"
                params.append(company_id)
            query += " ORDER BY name ASC"

            cursor.execute(query, params)
            zones = []
            for row in cursor.fetchall():
                d = dict(row)
                d["allowed_companies"] = json.loads(d["allowed_companies"] or "[]")
                d["authorized_user_ids"] = json.loads(d["authorized_user_ids"] or "[]")
                zones.append(ParkingZone.from_dict(d))
            return zones

    @staticmethod
    def search_zones(query_str: str, max_price: Optional[float] = None, ev_required: bool = False) -> List[ParkingZone]:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            q = f"%{query_str.lower().strip()}%"
            query = """
                SELECT * FROM parking_zones 
                WHERE status = 'ACTIVE' 
                  AND (LOWER(name) LIKE ? OR LOWER(address) LIKE ? OR LOWER(zone_code) LIKE ?)
            """
            params = [q, q, q]
            if max_price is not None:
                query += " AND price_per_hour <= ?"
                params.append(max_price)
            if ev_required:
                query += " AND ev_spaces > 0"

            cursor.execute(query, params)
            zones = []
            for row in cursor.fetchall():
                d = dict(row)
                d["allowed_companies"] = json.loads(d["allowed_companies"] or "[]")
                d["authorized_user_ids"] = json.loads(d["authorized_user_ids"] or "[]")
                zones.append(ParkingZone.from_dict(d))
            return zones

    @staticmethod
    def update_spaces(zone_id: str, available_delta: int) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE parking_zones 
                SET available_spaces = MAX(0, MIN(total_spaces, available_spaces + ?)),
                    occupied_spaces = MAX(0, MIN(total_spaces, occupied_spaces - ?))
                WHERE id = ?
            """, (available_delta, available_delta, zone_id))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def update_tariff(zone_id: str, new_price_per_hour: float) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE parking_zones SET price_per_hour = ? WHERE id = ?", (new_price_per_hour, zone_id))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def toggle_status(zone_id: str) -> bool:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT status FROM parking_zones WHERE id = ?", (zone_id,))
            row = cursor.fetchone()
            if not row:
                return False
            new_st = "INACTIVE" if row["status"] == "ACTIVE" else "ACTIVE"
            cursor.execute("UPDATE parking_zones SET status = ? WHERE id = ?", (new_st, zone_id))
            conn.commit()
            return True
