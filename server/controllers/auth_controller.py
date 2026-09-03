"""
SmartPark Authentication & User Profile Controller
Handles POST /api/auth/login, POST /api/auth/signup, GET /api/auth/me, PATCH /api/auth/profile
"""

import uuid
from typing import Dict, Any
from server.database.repositories.user_repository import UserRepository
from server.database.repositories.vehicle_repository import VehicleRepository
from server.database.repositories.audit_log_repository import AuditLogRepository
from server.middleware.request_validator import RequestValidator
from server.middleware.error_handler import SmartParkAPIException, UnauthorizedException, ConflictException
from server.models.schema import User, Vehicle, AuditLog

class AuthController:
    @staticmethod
    def login(data: Dict[str, Any], client_ip: str = "127.0.0.1") -> Dict[str, Any]:
        RequestValidator.validate_login(data)
        email = data["email"].lower().strip()
        password = data["password"]

        user = UserRepository.get_by_email(email)
        if not user or user.password_hash != password:
            raise UnauthorizedException("Invalid email address or password provided.")

        user_dict = user.to_dict()
        if "password_hash" in user_dict:
            del user_dict["password_hash"]

        token = f"jwt-{uuid.uuid4().hex}"

        # Audit
        AuditLogRepository.create(AuditLog(
            user_id=user.id,
            user_email=user.email,
            action="USER_LOGIN_SUCCESS",
            resource_type="User",
            resource_id=user.id,
            details={"role": user.role},
            ip_address=client_ip
        ))

        return {"success": True, "token": token, "user": user_dict}

    @staticmethod
    def signup(data: Dict[str, Any], client_ip: str = "127.0.0.1") -> Dict[str, Any]:
        RequestValidator.validate_signup(data)
        email = data["email"].lower().strip()

        if UserRepository.get_by_email(email):
            raise ConflictException("An account with this email address already exists. Please sign in.")

        user_id = f"usr-{uuid.uuid4().hex[:8]}"
        name = data["name"].strip()
        company_id = data.get("company_id")

        if company_id == "none" or not company_id:
            company_id = None
            company_name = None
            company_verified = False
            private_access = []
        else:
            company_name = data.get("company_name", "Corporate Partner")
            company_verified = True
            private_access = ["zone-pvt-01", "zone-pvt-06"] if "tcs" in str(company_id).lower() else ["zone-pvt-02", "zone-pvt-03"]

        new_user = User(
            id=user_id,
            name=name,
            email=email,
            password_hash=data["password"],
            role="USER",
            company_id=company_id,
            company_name=company_name,
            employee_id=data.get("employee_id"),
            company_verified=company_verified,
            phone=data.get("phone"),
            avatar_initials=name[0].upper() if name else "U",
            private_parking_access=private_access
        )

        UserRepository.create(new_user)

        # Register default vehicle
        plate = data.get("vehicle_plate", "KA-01-AB-1001").upper().strip()
        veh_type = data.get("vehicle_type", "CAR")
        VehicleRepository.create(Vehicle(
            id=f"veh-{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            registration_plate=plate,
            vehicle_type=veh_type,
            brand="Standard",
            model="Model",
            is_ev="EV" in veh_type,
            is_default=True
        ))

        # Audit
        AuditLogRepository.create(AuditLog(
            user_id=user_id,
            user_email=email,
            action="USER_REGISTER_SUCCESS",
            resource_type="User",
            resource_id=user_id,
            details={"company_id": company_id},
            ip_address=client_ip
        ))

        user_dict = new_user.to_dict()
        del user_dict["password_hash"]

        return {"success": True, "token": f"jwt-{uuid.uuid4().hex}", "user": user_dict}
