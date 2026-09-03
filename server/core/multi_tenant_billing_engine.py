"""
SmartPark Corporate Multi-Tenant Monthly Billing & Reconciliation Engine
Generates post-paid billing summaries, applies corporate volume discounts (5-15%), reconciles employee badge overages, and calculates GST taxes.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime

class MultiTenantBillingEngine:
    CORPORATE_DISCOUNT_TIERS = [
        {"min_stalls": 100, "discount_pct": 15.0, "tier_name": "ENTERPRISE_PLATINUM"},
        {"min_stalls": 50, "discount_pct": 10.0, "tier_name": "CORPORATE_GOLD"},
        {"min_stalls": 20, "discount_pct": 5.0, "tier_name": "BUSINESS_SILVER"},
        {"min_stalls": 0, "discount_pct": 0.0, "tier_name": "STANDARD_PARTNER"}
    ]

    @staticmethod
    def generate_monthly_invoice(
        company_id: str,
        company_name: str,
        allocated_stalls: int,
        base_monthly_rate_per_stall: float = 2500.0,
        guest_hours_consumed: float = 140.0,
        guest_hourly_rate: float = 25.0
    ) -> Dict[str, Any]:
        """Calculates itemized corporate statement with volume discounts and statutory taxes."""
        # Determine discount tier
        discount_pct = 0.0
        tier_name = "STANDARD_PARTNER"
        for tier in MultiTenantBillingEngine.CORPORATE_DISCOUNT_TIERS:
            if allocated_stalls >= tier["min_stalls"]:
                discount_pct = tier["discount_pct"]
                tier_name = tier["tier_name"]
                break

        gross_stall_fees = allocated_stalls * base_monthly_rate_per_stall
        discount_amount = round(gross_stall_fees * (discount_pct / 100.0), 2)
        net_stall_fees = gross_stall_fees - discount_amount

        guest_overage_fees = round(guest_hours_consumed * guest_hourly_rate, 2)
        subtotal = round(net_stall_fees + guest_overage_fees, 2)

        cgst_tax = round(subtotal * 0.09, 2)
        sgst_tax = round(subtotal * 0.09, 2)
        grand_total = round(subtotal + cgst_tax + sgst_tax, 2)

        invoice_number = f"CORP-INV-{datetime.utcnow().strftime('%Y%m')}-{company_id.replace('comp-', '').upper()}"

        return {
            "invoice_number": invoice_number,
            "billing_period": datetime.utcnow().strftime("%B %Y"),
            "company_id": company_id,
            "company_name": company_name,
            "discount_tier": tier_name,
            "discount_percentage": discount_pct,
            "line_items": [
                {
                    "description": f"Dedicated Corporate Stall Allocation ({allocated_stalls} Stalls @ ₹{base_monthly_rate_per_stall:,.0f}/mo)",
                    "gross_amount": gross_stall_fees,
                    "discount_applied": discount_amount,
                    "net_amount": net_stall_fees
                },
                {
                    "description": f"Executive Guest & Visitor Pre-Clearance ({guest_hours_consumed} Hours @ ₹{guest_hourly_rate:.0f}/hr)",
                    "gross_amount": guest_overage_fees,
                    "discount_applied": 0.0,
                    "net_amount": guest_overage_fees
                }
            ],
            "subtotal": subtotal,
            "cgst_9pct": cgst_tax,
            "sgst_9pct": sgst_tax,
            "grand_total_inr": grand_total,
            "payment_terms": "NET_30_DAYS",
            "invoice_status": "ISSUED"
        }
