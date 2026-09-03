"""
SmartPark Fine-Grained Role-Based Access Control (RBAC) Engine
Evaluates permissions across Platform Admins, Corporate Facility Managers, Security Enforcement Officers, Auditors, and Drivers.
"""

from typing import Dict, List, Any, Optional

class UserRole:
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    CORPORATE_MANAGER = "CORPORATE_MANAGER"
    ENFORCEMENT_OFFICER = "ENFORCEMENT_OFFICER"
    USER = "USER"
    GUEST = "GUEST"

class RBACPolicyEvaluator:
    # Action Permissions Matrix
    PERMISSIONS = {
        UserRole.SUPER_ADMIN: ["*"],
        UserRole.ADMIN: [
            "zone:read", "zone:write", "zone:delete",
            "slot:read", "slot:write", "slot:override",
            "user:read", "user:write", "user:disable",
            "company:read", "company:write",
            "reservation:read_all", "reservation:cancel_any",
            "violation:read_all", "violation:write", "violation:resolve", "violation:dismiss",
            "telemetry:read", "telemetry:control",
            "analytics:read_all", "audit:read_all", "financial:read_all"
        ],
        UserRole.CORPORATE_MANAGER: [
            "zone:read_company", "slot:read_company",
            "employee:read_company", "employee:invite", "employee:revoke",
            "reservation:read_company", "visitor_pass:issue",
            "analytics:read_company", "billing:read_company"
        ],
        UserRole.ENFORCEMENT_OFFICER: [
            "zone:read", "slot:read", "slot:override",
            "violation:read_all", "violation:write", "violation:attach_evidence",
            "barrier:emergency_open", "alpr:query"
        ],
        UserRole.USER: [
            "zone:read_public", "zone:read_authorized_private",
            "slot:read", "reservation:create", "reservation:read_own",
            "reservation:cancel_own", "vehicle:manage_own",
            "pass:view_own", "receipt:view_own", "violation:view_own", "violation:dispute_own"
        ],
        UserRole.GUEST: [
            "zone:read_public"
        ]
    }

    @staticmethod
    def is_authorized(user: Optional[Dict[str, Any]], required_permission: str, resource_context: Optional[Dict[str, Any]] = None) -> bool:
        """Determines if the requesting identity holds permission to execute target action."""
        if not user:
            role = UserRole.GUEST
        else:
            role = user.get("role", UserRole.USER)

        allowed_perms = RBACPolicyEvaluator.PERMISSIONS.get(role, [])
        if "*" in allowed_perms:
            return True

        if required_permission in allowed_perms:
            # Check company context segregation if applicable
            if role == UserRole.CORPORATE_MANAGER and resource_context:
                target_company = resource_context.get("company_id")
                user_company = user.get("company_id")
                if target_company and user_company and target_company != user_company:
                    return False
            return True

        return False
