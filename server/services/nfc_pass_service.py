"""
SmartPark Contactless NFC Pass & Pre-Paid Smart Card Service
Handles tap-in balance deductions, automatic wallet reload triggers, and digital card provisioning.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.nfc_pass_repository import NFCRepository, NFCSmartPass

class NFCService:
    @staticmethod
    def get_or_provision_card(user: Dict[str, Any]) -> Dict[str, Any]:
        card = NFCRepository.get_by_user(user["id"])
        if not card:
            card = NFCSmartPass(
                user_id=user["id"],
                card_uid=f"04{user['id'][:6].upper()}FF",
                card_label="SmartPark Platinum NFC Pass",
                balance=1250.0
            )
            NFCRepository.create(card)

        return {"success": True, "card": card.to_dict()}
