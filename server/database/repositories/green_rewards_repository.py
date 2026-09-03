"""
SmartPark Green Driver Rewards & Carbon Credit Repository Layer
Manages eco-points earned via EV charging, carpooling, off-peak arrivals, and reward redemptions.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class GreenRewardWallet:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        total_eco_points: int = 420,
        co2_saved_kg_lifetime: float = 86.4,
        tier: str = "GREEN_CHAMPION",  # ECO_STARTER | GREEN_COMMUTER | GREEN_CHAMPION
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"rew-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.total_eco_points = total_eco_points
        self.co2_saved_kg_lifetime = co2_saved_kg_lifetime
        self.tier = tier
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_eco_points": self.total_eco_points,
            "co2_saved_kg_lifetime": self.co2_saved_kg_lifetime,
            "tier": self.tier,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class GreenRewardsRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS green_rewards_wallets (
                    id TEXT PRIMARY KEY,
                    user_id TEXT UNIQUE NOT NULL,
                    total_eco_points INTEGER DEFAULT 420,
                    co2_saved_kg_lifetime REAL DEFAULT 86.4,
                    tier TEXT DEFAULT 'GREEN_CHAMPION',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_or_create(user_id: str) -> GreenRewardWallet:
        GreenRewardsRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM green_rewards_wallets WHERE user_id = ?", (user_id,))
            row = cursor.fetchone()
            if row:
                return GreenRewardWallet(**dict(row))
            wallet = GreenRewardWallet(user_id=user_id)
            cursor.execute("""
                INSERT INTO green_rewards_wallets (id, user_id, total_eco_points, co2_saved_kg_lifetime, tier, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (wallet.id, wallet.user_id, wallet.total_eco_points, wallet.co2_saved_kg_lifetime, wallet.tier, datetime.utcnow().isoformat()))
            conn.commit()
            return wallet

GreenRewardsRepository.init_table()
