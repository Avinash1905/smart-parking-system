"""
SmartPark Eco-Commuter & Loyalty Rewards Program Service
Tracks green parking points earned via EV charging, carpooling, off-peak parking,
and manages discount voucher redemptions.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime

class LoyaltyRewardsService:
    REWARD_CATALOG = [
        {"reward_id": "REW-101", "title": "1 Hour Free Parking Voucher", "cost_points": 250, "discount_type": "FREE_HOUR"},
        {"reward_id": "REW-102", "title": "50% Off EV Rapid Charging Session", "cost_points": 500, "discount_type": "EV_50_PCT"},
        {"reward_id": "REW-103", "title": "VIP Reserved Spot Pass (1 Day)", "cost_points": 1000, "discount_type": "VIP_PASS"},
        {"reward_id": "REW-104", "title": "Metro Feeder Free Transit Pass", "cost_points": 150, "discount_type": "TRANSIT_PASS"}
    ]

    @classmethod
    def get_user_rewards_profile(cls, user_id: str) -> Dict[str, Any]:
        """Calculates loyalty status, points balance, and earned carbon credits."""
        # Simulated user point profile
        points = 840
        tier = "GOLD" if points >= 750 else ("SILVER" if points >= 300 else "STANDARD")
        
        return {
            "user_id": user_id,
            "points_balance": points,
            "lifetime_points_earned": 1420,
            "loyalty_tier": tier,
            "tier_perks": [
                "15% Discount on all dynamic peak tariffs",
                "Priority EV bay allocation algorithm",
                "Extended 30-minute overstay grace period"
            ],
            "carbon_kg_saved": 145.2,
            "available_catalog": cls.REWARD_CATALOG
        }

    @classmethod
    def redeem_reward(cls, user_id: str, reward_id: str) -> Dict[str, Any]:
        reward = next((r for r in cls.REWARD_CATALOG if r["reward_id"] == reward_id), None)
        if not reward:
            return {"success": False, "message": "Reward item not found in catalog"}

        voucher_code = f"ECO-{uuid.uuid4().hex[:8].upper()}"
        return {
            "success": True,
            "voucher_code": voucher_code,
            "reward": reward,
            "redeemed_at": datetime.now().isoformat(),
            "message": f"Successfully redeemed '{reward['title']}'. Code: {voucher_code}"
        }
