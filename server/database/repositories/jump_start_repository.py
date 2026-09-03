"""
SmartPark Emergency Battery Jump-Start Mobile Assistance Cart Repository Layer
Manages 12V/24V 2500A peak lithium jump starters, reverse polarity protection, and on-demand vehicle bay roadside dispatches.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class JumpStartCartNode:
    def __init__(
        self,
        id: str = "",
        cart_code: str = "JUMP-CART-B1-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Floor B1 Assistance Staging",
        battery_pack_charge_pct: int = 98,
        peak_cranking_amperage: float = 2500.0,
        reverse_polarity_safety_locked: bool = True,
        dispatches_today_count: int = 6,
        cart_status: str = "CHARGED_READY_DISPATCH",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"jsc-{uuid.uuid4().hex[:8]}"
        self.cart_code = cart_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.battery_pack_charge_pct = battery_pack_charge_pct
        self.peak_cranking_amperage = peak_cranking_amperage
        self.reverse_polarity_safety_locked = reverse_polarity_safety_locked
        self.dispatches_today_count = dispatches_today_count
        self.cart_status = cart_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "cart_code": self.cart_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "battery_pack_charge_pct": self.battery_pack_charge_pct,
            "peak_cranking_amperage": self.peak_cranking_amperage,
            "reverse_polarity_safety_locked": self.reverse_polarity_safety_locked,
            "dispatches_today_count": self.dispatches_today_count,
            "cart_status": self.cart_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class JumpStartRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS jump_start_cart_nodes (
                    id TEXT PRIMARY KEY,
                    cart_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    battery_pack_charge_pct INTEGER DEFAULT 98,
                    peak_cranking_amperage REAL DEFAULT 2500.0,
                    reverse_polarity_safety_locked INTEGER DEFAULT 1,
                    dispatches_today_count INTEGER DEFAULT 6,
                    cart_status TEXT DEFAULT 'CHARGED_READY_DISPATCH',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> JumpStartCartNode:
        JumpStartRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM jump_start_cart_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["reverse_polarity_safety_locked"] = bool(d["reverse_polarity_safety_locked"])
                return JumpStartCartNode(**d)
            cart = JumpStartCartNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO jump_start_cart_nodes (
                    id, cart_code, zone_id, floor_level,
                    battery_pack_charge_pct, peak_cranking_amperage,
                    reverse_polarity_safety_locked,
                    dispatches_today_count, cart_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                cart.id, cart.cart_code, cart.zone_id, cart.floor_level,
                cart.battery_pack_charge_pct,
                cart.peak_cranking_amperage,
                1 if cart.reverse_polarity_safety_locked else 0,
                cart.dispatches_today_count, cart.cart_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return cart

JumpStartRepository.init_table()
