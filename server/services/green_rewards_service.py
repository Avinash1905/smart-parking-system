"""
SmartPark Carbon Credits & Green Driver Rewards Service
Tracks carbon offset points and handles redemption for parking fee discounts.
"""

from typing import Dict, Any, List
from server.database.repositories.green_rewards_repository import GreenRewardsRepository, GreenRewardWallet

class GreenRewardsService:
    @staticmethod
    def get_wallet(user_id: str) -> Dict[str, Any]:
        wallet = GreenRewardsRepository.get_or_create(user_id)
        return {
            "success": True,
            "wallet": wallet.to_dict(),
            "available_vouchers": [
                {"id": "vch-50", "name": "₹50 Off Next Municipal Parking Session", "cost_points": 100},
                {"id": "vch-ev", "name": "10 kWh Free EV Fast Charging Credit", "cost_points": 250},
                {"id": "vch-wash", "name": "Free Eco Hand Car Wash Voucher", "cost_points": 400}
            ]
        }
