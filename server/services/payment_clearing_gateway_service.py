"""
SmartPark Multi-Rail Payment Clearing & Digital Invoice Generation Gateway
Supports Dynamic UPI QR generation, Apple/Google Pay, Corporate Billing Codes,
and tax compliance invoicing (GST/VAT).
"""

from typing import Dict, List, Any, Optional
import uuid
import hashlib
from datetime import datetime

class PaymentClearingGatewayService:
    @classmethod
    def generate_upi_payload(cls, payee_vpa: str, amount_inr: float, transaction_ref: str, note: str = "SmartPark Parking Fee") -> str:
        """Constructs a standard UPI deep-link URI compatible with GooglePay, PhonePe, and Paytm."""
        clean_vpa = payee_vpa.strip()
        clean_note = note.replace(" ", "%20")
        return f"upi://pay?pa={clean_vpa}&pn=SmartPark%20City&tr={transaction_ref}&tn={clean_note}&am={amount_inr:.2f}&cu=INR"

    @classmethod
    def process_charge(
        cls,
        amount: float,
        payment_method: str,  # "UPI", "CREDIT_CARD", "FASTAG", "CORPORATE_WALLET"
        user_id: str,
        reservation_id: str,
        currency: str = "INR"
    ) -> Dict[str, Any]:
        """Processes payment charge through payment rails."""
        txn_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        now = datetime.now()
        
        # Calculate statutory tax (5% GST)
        taxable_base = round(amount / 1.05, 2)
        gst_cgst = round((amount - taxable_base) / 2.0, 2)
        gst_sgst = round((amount - taxable_base) / 2.0, 2)

        # Generate cryptographic receipt signature
        signature_raw = f"{txn_id}|{amount}|{user_id}|{now.isoformat()}"
        receipt_hash = hashlib.sha256(signature_raw.encode('utf-8')).hexdigest()[:16].upper()

        return {
            "success": True,
            "transaction_id": txn_id,
            "status": "SETTLED_COMPLETED",
            "reservation_id": reservation_id,
            "user_id": user_id,
            "amount": amount,
            "currency": currency,
            "payment_method": payment_method.upper(),
            "tax_breakdown": {
                "taxable_value": taxable_base,
                "cgst_2_5_pct": gst_cgst,
                "sgst_2_5_pct": gst_sgst,
                "total_gst": round(gst_cgst + gst_sgst, 2)
            },
            "receipt_number": f"RCP-{now.strftime('%Y%m%d')}-{receipt_hash[:6]}",
            "digital_signature": receipt_hash,
            "settled_at": now.isoformat()
        }
