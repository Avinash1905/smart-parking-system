"""
Unit Tests for SmartPark Parking Zone and Bay Discovery Services.
"""

import unittest
from server.services.business_services import ParkingService, SlotService

class TestParkingService(unittest.TestCase):
    def test_get_public_zones(self):
        zones = ParkingService.get_all_zones(category="PUBLIC")
        self.assertIsInstance(zones, list)
        self.assertGreater(len(zones), 0)
        for z in zones:
            self.assertEqual(z["category"], "PUBLIC")

    def test_get_slots_by_zone(self):
        zones = ParkingService.get_all_zones(category="PUBLIC")
        zone_id = zones[0]["id"]
        slots = SlotService.get_slots_by_zone(zone_id)
        self.assertIsInstance(slots, list)
        self.assertGreater(len(slots), 0)
        self.assertIn("slot_number", slots[0])
        self.assertIn("status", slots[0])

    def test_zone_details_by_id(self):
        zone = ParkingService.get_zone_by_id("zone-pub-01")
        self.assertIsNotNone(zone)
        self.assertEqual(zone["id"], "zone-pub-01")

if __name__ == "__main__":
    unittest.main()
