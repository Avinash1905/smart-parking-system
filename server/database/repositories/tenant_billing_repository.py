"""
SmartPark Multi-Tenant Corporate Billing & Invoicing Repository Layer
Manages monthly consolidated parking billing statements for enterprise tenants (TCS, Infosys, Wipro).
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class TenantBillingInvoice:
    def __init__(
        self,
        id: str = "",
        invoice_code: str = "INV-TCS-2026-08",
        company_id: str = "cmp-tcs",
        company_name: str = "Tata Consultancy Services (TCS)",
        billing_cycle: str = "August 2026",
        total_employee_sessions: int = 18420,
        subtotal_inr: float = 368400.0,
        gst_tax_inr: float = 66312.0,
        total_payable_inr: float = 434712.0,
        status: str = "PAID_SETTLED",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"inv-{uuid.uuid4().hex[:8]}"
        self.invoice_code = invoice_code
        self.company_id = company_id
        self.company_name = company_name
        self.billing_cycle = billing_cycle
        self.total_employee_sessions = total_employee_sessions
        self.subtotal_inr = subtotal_inr
        self.gst_tax_inr = gst_tax_inr
        self.total_payable_inr = total_payable_inr
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "invoice_code": self.invoice_code,
            "company_id": self.company_id,
            "company_name": self.company_name,
            "billing_cycle": self.billing_cycle,
            "total_employee_sessions": self.total_employee_sessions,
            "subtotal_inr": self.subtotal_inr,
            "gst_tax_inr": self.gst_tax_inr,
            "total_payable_inr": self.total_payable_inr,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class TenantBillingRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tenant_billing_invoices (
                    id TEXT PRIMARY KEY,
                    invoice_code TEXT UNIQUE NOT NULL,
                    company_id TEXT NOT NULL,
                    company_name TEXT NOT NULL,
                    billing_cycle TEXT NOT NULL,
                    total_employee_sessions INTEGER DEFAULT 18420,
                    subtotal_inr REAL DEFAULT 368400.0,
                    gst_tax_inr REAL DEFAULT 66312.0,
                    total_payable_inr REAL DEFAULT 434712.0,
                    status TEXT DEFAULT 'PAID_SETTLED',
                    created_at TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def list_all() -> List[TenantBillingInvoice]:
        TenantBillingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tenant_billing_invoices ORDER BY created_at DESC")
            return [TenantBillingInvoice(**dict(r)) for r in cursor.fetchall()]

    @staticmethod
    def create(item: TenantBillingInvoice) -> bool:
        TenantBillingRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO tenant_billing_invoices (
                    id, invoice_code, company_id, company_name,
                    billing_cycle, total_employee_sessions,
                    subtotal_inr, gst_tax_inr, total_payable_inr,
                    status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.id, item.invoice_code, item.company_id,
                item.company_name, item.billing_cycle,
                item.total_employee_sessions, item.subtotal_inr,
                item.gst_tax_inr, item.total_payable_inr,
                item.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

TenantBillingRepository.init_table()
