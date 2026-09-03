"""
SmartPark P2P Escrow & Automated Dispute Chargeback Settlement Service
Holds sublet rental funds in digital escrow until reservation completion,
and executes automated refund rollbacks if a spot was blocked by an unauthorized vehicle.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime

_ESCROW_ACCOUNTS: Dict[str, Dict[str, Any]] = {
    "ESC-701": {
        "escrow_id": "ESC-701",
        "booking_id": "SUB-201",
        "renter_id": "usr-8812",
        "host_id": "usr-4102",
        "amount_inr": 80.0,
        "status": "HELD_IN_ESCROW",
        "created_at": "2026-09-03T10:00:00"
    }
}

class PaymentEscrowSettlementService:
    @staticmethod
    def release_funds_to_host(escrow_id: str) -> Dict[str, Any]:
        if escrow_id not in _ESCROW_ACCOUNTS:
            return {"success": False, "message": "Escrow hold not found"}

        esc = _ESCROW_ACCOUNTS[escrow_id]
        esc["status"] = "SETTLED_RELEASED_TO_HOST"
        esc["released_at"] = datetime.now().isoformat()
        return {"success": True, "message": f"₹{esc['amount_inr']:.2f} released to host account.", "escrow": esc}

    @staticmethod
    def refund_to_renter(escrow_id: str, reason: str = "SPOT_OCCUPIED_BY_UNAUTHORIZED_CAR") -> Dict[str, Any]:
        if escrow_id not in _ESCROW_ACCOUNTS:
            return {"success": False, "message": "Escrow hold not found"}

        esc = _ESCROW_ACCOUNTS[escrow_id]
        esc["status"] = "REFUNDED_TO_RENTER"
        esc["refund_reason"] = reason
        esc["refunded_at"] = datetime.now().isoformat()
        return {"success": True, "message": f"Full refund of ₹{esc['amount_inr']:.2f} credited to original payment rail.", "escrow": esc}
