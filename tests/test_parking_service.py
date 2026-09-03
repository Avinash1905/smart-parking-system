"""
Unit Tests for SmartPark Parking & Slot Services
"""

import pytest
from server.services.business_services import ParkingService, SlotService

def test_get_all_zones():
    zones = ParkingService.get_all_zones()
    assert len(zones) > 0
    assert any(z["category"] == "PUBLIC" for z in zones)

def test_get_public_zones():
    public_zones = ParkingService.get_all_zones(category="PUBLIC")
    assert len(public_zones) > 0
    for z in public_zones:
        assert z["category"] == "PUBLIC"

def test_get_zone_by_id():
    zone = ParkingService.get_zone_by_id("zone-pub-01")
    assert zone is not None
    assert "name" in zone
    assert zone["total_spaces"] > 0

def test_get_slots_by_zone():
    slots = SlotService.get_slots_by_zone("zone-pub-01")
    assert len(slots) > 0
    assert "slot_number" in slots[0]
    assert "status" in slots[0]
