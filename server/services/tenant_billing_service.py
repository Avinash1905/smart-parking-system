"""
SmartPark Tenant Billing & Consolidated GST Invoicing Service
Generates monthly itemized corporate statements for campus parking allowances.
"""

from typing import Dict, Any, List
from server.database.repositories.tenant_billing_repository import TenantBillingRepository, TenantBillingInvoice

class TenantBillingService:
    @staticmethod
    def get_invoices() -> List[Dict[str, Any]]:
        invoices = TenantBillingRepository.list_all()
        if not invoices:
            sample = [
                TenantBillingInvoice(invoice_code="INV-TCS-2026-08", company_name="Tata Consultancy Services", billing_cycle="August 2026", total_payable_inr=434712.0)
            ]
            for s in sample:
                TenantBillingRepository.create(s)
            invoices = TenantBillingRepository.list_all()

        return [i.to_dict() for i in invoices]
