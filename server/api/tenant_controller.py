"""
SmartPark Corporate Tenant & Employee Whitelist API Controller
Manages corporate accounts, badge allocations, visitor quotas, and monthly billing statements.
"""

from typing import Dict, Any, List
from server.services.business_services import AuthService, ParkingService
from server.core.rbac_policy_evaluator import RBACPolicyEvaluator, UserRole

class TenantController:
    @staticmethod
    def get_tenant_roster(company_id: str, requesting_user: Dict[str, Any]) -> Dict[str, Any]:
        """Fetches active employee list and parking access allocations for a corporate partner."""
        try:
            is_admin = requesting_user.get("role") in [UserRole.ADMIN, UserRole.SUPER_ADMIN]
            is_manager = requesting_user.get("role") == UserRole.CORPORATE_MANAGER and requesting_user.get("company_id") == company_id

            if not (is_admin or is_manager):
                return {"success": False, "error": "Unauthorized: Tenant manager or platform administrator role required."}

            return {
                "success": True,
                "company_id": company_id,
                "company_name": "Tata Consultancy Services" if "tcs" in company_id.lower() else "Infosys Limited",
                "allocated_stalls": 50,
                "active_badges": 42,
                "guest_quota_remaining": 8,
                "billing_cycle": "MONTHLY_POSTPAID",
                "monthly_accrued_inr": 84500.0
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
