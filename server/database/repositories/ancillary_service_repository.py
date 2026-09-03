"""
SmartPark Ancillary Services Repository Layer
Manages add-on amenities booked alongside parking (Eco Car Wash, Tire Pressure Check, Interior Detailing).
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class AncillaryServiceBooking:
    def __init__(
        self,
        id: str = "",
        reservation_id: str = "",
        user_id: str = "",
        service_type: str = "ECO_WATERLESS_WASH",  # ECO_WATERLESS_WASH | INTERIOR_CLEAN | TIRE_PRESSURE_FILL
        service_name: str = "Eco Waterless Hand Car Wash",
        price: float = 199.0,
        status: str = "CONFIRMED",  # CONFIRMED | IN_PROGRESS | COMPLETED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"anc-{uuid.uuid4().hex[:8]}"
        self.reservation_id = reservation_id
        self.user_id = user_id
        self.service_type = service_type
        self.service_name = service_name
        self.price = price
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "reservation_id": self.reservation_id,
            "user_id": self.user_id,
            "service_type": self.service_type,
            "service_name": self.service_name,
            "price": self.price,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class AncillaryServiceRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS ancillary_service_bookings (
                    id TEXT PRIMARY KEY,
                    reservation_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    service_type TEXT NOT NULL,
                    service_name TEXT NOT NULL,
                    price REAL DEFAULT 199.0,
                    status TEXT DEFAULT 'CONFIRMED',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(booking: AncillaryServiceBooking) -> bool:
        AncillaryServiceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO ancillary_service_bookings (
                    id, reservation_id, user_id, service_type,
                    service_name, price, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                booking.id, booking.reservation_id, booking.user_id,
                booking.service_type, booking.service_name, booking.price,
                booking.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_by_user(user_id: str) -> List[AncillaryServiceBooking]:
        AncillaryServiceRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM ancillary_service_bookings WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            return [AncillaryServiceBooking(**dict(r)) for r in cursor.fetchall()]

AncillaryServiceRepository.init_table()
