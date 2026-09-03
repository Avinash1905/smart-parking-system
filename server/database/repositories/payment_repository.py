"""
SmartPark Payment & Financial Transaction Repository Layer
Handles UPI intent generation, saved credit card tokens, fleet corporate billing, and settlement records.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class PaymentTransaction:
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        reservation_id: str = "",
        amount: float = 40.0,
        currency: str = "INR",
        payment_method: str = "UPI_INTENT",  # UPI_INTENT | CREDIT_CARD | FLEET_WALLET | CORPORATE_INVOICE
        transaction_reference: str = "",
        gateway_provider: str = "RAZORPAY_MOCK",
        status: str = "SUCCESS",  # SUCCESS | PENDING | FAILED | REFUNDED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"txn-{uuid.uuid4().hex[:10]}"
        self.user_id = user_id
        self.reservation_id = reservation_id
        self.amount = amount
        self.currency = currency
        self.payment_method = payment_method
        self.transaction_reference = transaction_reference or f"REF-{uuid.uuid4().hex[:12].upper()}"
        self.gateway_provider = gateway_provider
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "reservation_id": self.reservation_id,
            "amount": self.amount,
            "currency": self.currency,
            "payment_method": self.payment_method,
            "transaction_reference": self.transaction_reference,
            "gateway_provider": self.gateway_provider,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class PaymentRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS payment_transactions (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    reservation_id TEXT NOT NULL,
                    amount REAL NOT NULL,
                    currency TEXT DEFAULT 'INR',
                    payment_method TEXT DEFAULT 'UPI_INTENT',
                    transaction_reference TEXT UNIQUE NOT NULL,
                    gateway_provider TEXT DEFAULT 'RAZORPAY_MOCK',
                    status TEXT DEFAULT 'SUCCESS',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(txn: PaymentTransaction) -> bool:
        PaymentRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO payment_transactions (
                    id, user_id, reservation_id, amount, currency,
                    payment_method, transaction_reference, gateway_provider,
                    status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                txn.id, txn.user_id, txn.reservation_id, txn.amount,
                txn.currency, txn.payment_method, txn.transaction_reference,
                txn.gateway_provider, txn.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def list_by_user(user_id: str) -> List[PaymentTransaction]:
        PaymentRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM payment_transactions WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
            return [PaymentTransaction(**dict(r)) for r in cursor.fetchall()]

PaymentRepository.init_table()
