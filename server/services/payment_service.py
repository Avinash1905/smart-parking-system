"""
SmartPark Payment Gateway & Fleet Settlement Service
Processes instant UPI QR intents, card authorization tokens, and corporate fleet wallet deductions.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.payment_repository import PaymentRepository, PaymentTransaction
from server.database.repositories.audit_log_repository import AuditLogRepository
from server.models.schema import AuditLog

class PaymentService:
    @staticmethod
    def process_payment(data: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        amount = float(data.get("amount", 40.0))
        method = data.get("payment_method", "UPI_INTENT")
        res_id = data.get("reservation_id", "RES-A2401")

        txn = PaymentTransaction(
            user_id=user["id"],
            reservation_id=res_id,
            amount=amount,
            currency="INR",
            payment_method=method,
            gateway_provider="RAZORPAY_MOCK",
            status="SUCCESS"
        )
        PaymentRepository.create(txn)

        AuditLogRepository.create(AuditLog(
            user_id=user["id"],
            user_email=user.get("email"),
            action="PAYMENT_SETTLED",
            resource_type="PaymentTransaction",
            resource_id=txn.id,
            details={"amount": amount, "method": method, "ref": txn.transaction_reference}
        ))

        return {
            "success": True,
            "transaction_id": txn.id,
            "transaction_reference": txn.transaction_reference,
            "amount": amount,
            "status": "SUCCESS",
            "receipt_url": f"#/receipt/{res_id}"
        }
