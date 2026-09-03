"""
SmartPark NETC FASTag Auto-Debit Parking Service
Coordinates windshield RFID tag scans with bank NPCI settlement for zero-stop barrier drive-through.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.fast_tag_repository import FASTagRepository, FASTagAccount

class FASTagService:
    @staticmethod
    def get_or_link_fastag(user: Dict[str, Any], plate: str = "KA-01-MJ-5890") -> Dict[str, Any]:
        acc = FASTagRepository.get_by_plate(plate)
        if not acc:
            acc = FASTagAccount(
                user_id=user["id"],
                vehicle_plate=plate,
                fastag_tag_id=f"34161FA8{user['id'][:6].upper()}",
                issuing_bank="ICICI Bank NETC FASTag",
                fastag_wallet_balance=850.0
            )
            FASTagRepository.create(acc)

        return {"success": True, "fastag": acc.to_dict()}
