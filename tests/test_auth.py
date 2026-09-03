"""
Unit and Integration Tests for SmartPark Authentication Services.
Tests user registration, corporate employee credential verification, and token authentication.
"""

import unittest
import uuid
from server.services.business_services import AuthService

class TestAuthService(unittest.TestCase):
    def test_signup_and_login_flow(self):
        test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        signup_data = {
            "name": "Rajesh Kumar",
            "email": test_email,
            "phone": "9876543210",
            "password": "SecurePassword123!",
            "vehicle_plate": "KA-01-AB-1234",
            "vehicle_type": "FOUR_WHEELER"
        }
        signup_res = AuthService.signup(signup_data)
        self.assertTrue(signup_res["success"])
        self.assertIn("user", signup_res)
        self.assertEqual(signup_res["user"]["email"], test_email)

        # Verify Login
        login_res = AuthService.login(test_email, "SecurePassword123!")
        self.assertTrue(login_res["success"])
        self.assertIn("token", login_res)

    def test_corporate_employee_signup(self):
        emp_email = f"emp_{uuid.uuid4().hex[:8]}@techcorp.com"
        signup_data = {
            "name": "Ananya Sharma",
            "email": emp_email,
            "phone": "9876543211",
            "password": "CorporatePass123!",
            "vehicle_plate": "KA-02-CD-5678",
            "vehicle_type": "FOUR_WHEELER",
            "company_id": "comp_tcs_hq",
            "company_name": "Tata Consultancy Services",
            "employee_id": "TCS-9012"
        }
        signup_res = AuthService.signup(signup_data)
        self.assertTrue(signup_res["success"])
        self.assertEqual(signup_res["user"]["company_id"], "comp_tcs_hq")
        self.assertTrue(signup_res["user"]["company_verified"])

if __name__ == "__main__":
    unittest.main()
