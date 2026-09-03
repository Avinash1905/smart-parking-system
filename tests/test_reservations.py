"""
Unit Tests for SmartPark Reservation Lifecycle Management.
"""

import unittest
import uuid
from server.services.business_services import AuthService, ParkingService, ReservationService

class TestReservationService(unittest.TestCase):
    def setUp(self):
        self.email = f"res_{uuid.uuid4().hex[:8]}@example.com"
        signup_res = AuthService.signup({
            "name": "Vikram Seth",
            "email": self.email,
            "phone": "9876500000",
            "password": "Password123!",
            "vehicle_plate": "KA-05-MN-9999",
            "vehicle_type": "FOUR_WHEELER"
        })
        self.user = signup_res["user"]

    def test_reservation_creation_and_retrieval(self):
        zones = ParkingService.get_all_zones("PUBLIC")
        zone_id = zones[0]["id"]

        booking_data = {
            "parking_zone_id": zone_id,
            "duration_hours": 2.0,
            "vehicle_plate": "KA-05-MN-9999",
            "vehicle_type": "Car"
        }

        # 1. Create Reservation
        booking = ReservationService.create_reservation(booking_data, self.user)
        self.assertTrue(booking["success"])
        self.assertIn("reservation_id", booking)
        self.assertIn("pass_code", booking)

        # 2. Get User Reservations
        user_res_list = ReservationService.get_user_reservations(self.user["id"])
        self.assertIsInstance(user_res_list, list)
        self.assertGreater(len(user_res_list), 0)
        self.assertEqual(user_res_list[0]["user_id"], self.user["id"])

if __name__ == "__main__":
    unittest.main()
