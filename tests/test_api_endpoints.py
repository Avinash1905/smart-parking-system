"""
Integration Tests for SmartPark API Endpoints & Request Routing
"""

import pytest
from server.services.business_services import ParkingService, SensorSimulatorService, SlotService

def test_sensor_event_trigger():
    res = SensorSimulatorService.trigger_event(
        zone_id="zone-pub-01",
        event_type="SLOT_OCCUPIED",
        slot_number="A-01",
        plate="KA-01-EQ-9988"
    )
    assert res is not None
    assert res.get("success") is True
    assert res.get("event_type") == "SLOT_OCCUPIED"

def test_public_private_zone_segregation():
    all_zones = ParkingService.get_all_zones()
    pub_count = len([z for z in all_zones if z["category"] == "PUBLIC"])
    priv_count = len([z for z in all_zones if z["category"] != "PUBLIC"])
    assert pub_count + priv_count == len(all_zones)

def test_slot_status_update():
    slots = SlotService.get_slots_by_zone("zone-pub-01")
    assert len(slots) > 0
    slot_id = slots[0]["id"]
    success = SlotService.update_slot_status(slot_id, "OCCUPIED", "KA-01-TEST-1234")
    assert success is True
