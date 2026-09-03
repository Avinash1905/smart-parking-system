"""
SmartPark Corporate Employee & Whitelist Clearance Service
Handles employee validation, department quota tracking, RFID assignment, and batch clearance issuance.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.employee_repository import EmployeeRepository, Employee
from server.database.repositories.user_repository import UserRepository
from server.database.repositories.audit_log_repository import AuditLogRepository
from server.models.schema import AuditLog

class EmployeeService:
    @staticmethod
    def get_company_roster(company_id: str, department: Optional[str] = None) -> List[Dict[str, Any]]:
        employees = EmployeeRepository.list_by_company(company_id, department=department)
        if not employees and company_id == "comp-tcs":
            # Auto-seed sample roster for TCS if empty
            seeds = [
                Employee(company_id="comp-tcs", company_name="TCS", name="Avinash Sharma", email="demo@smartpark.com", employee_code="TCS-1024", department="Cloud Architecture", rfid_badge_id="RFID-TCS-001", vehicle_plate="KA-01-MJ-5890", access_tier="EXECUTIVE"),
                Employee(company_id="comp-tcs", company_name="TCS", name="Pooja Hegde", email="pooja.h@tcs.com", employee_code="TCS-4412", department="Engineering", rfid_badge_id="RFID-TCS-002", vehicle_plate="KA-03-HA-8822", access_tier="FULL_ACCESS"),
                Employee(company_id="comp-tcs", company_name="TCS", name="Suresh Menon", email="suresh.m@tcs.com", employee_code="TCS-9012", department="Product Operations", rfid_badge_id="RFID-TCS-003", vehicle_plate="KA-05-MN-9901", access_tier="HYBRID_DAYS")
            ]
            for s in seeds:
                EmployeeRepository.create(s)
            employees = EmployeeRepository.list_by_company(company_id)

        return [e.to_dict() for e in employees]

    @staticmethod
    def register_employee(data: Dict[str, Any], admin_id: str = "adm-001") -> Dict[str, Any]:
        emp = Employee(
            company_id=data["company_id"],
            company_name=data.get("company_name", "Corporate Partner"),
            name=data["name"],
            email=data["email"],
            employee_code=data["employee_code"],
            department=data.get("department", "Engineering"),
            vehicle_plate=data["vehicle_plate"],
            allocated_zone_id=data.get("allocated_zone_id", "zone-pvt-01"),
            access_tier=data.get("access_tier", "FULL_ACCESS"),
            clearance_status="ACTIVE"
        )
        EmployeeRepository.create(emp)

        # Link to User profile if exists
        user = UserRepository.get_by_email(emp.email)
        if user:
            access = list(set(user.private_parking_access + [emp.allocated_zone_id]))
            UserRepository.update_access_list(user.id, access)

        AuditLogRepository.create(AuditLog(
            user_id=admin_id,
            user_email="admin@smartpark.com",
            action="EMPLOYEE_CLEARANCE_ISSUED",
            resource_type="Employee",
            resource_id=emp.id,
            details={"employee_code": emp.employee_code, "company_id": emp.company_id}
        ))

        return {"success": True, "employee_id": emp.id, "data": emp.to_dict()}
