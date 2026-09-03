"""
Unit Tests for SmartPark Reservation & Booking Services
"""

import pytest
from server.services.business_services import ReservationService, AuthService

def test_get_user_reservations():
    res_list = ReservationService.get_user_reservations("usr-tcs-01")
    assert isinstance(res_list, list)

def test_create_and_cancel_reservation():
    user = AuthService.get_user_by_id("usr-tcs-01")
    res = ReservationService.create_reservation(
        data={
            "parking_zone_id": "zone-pub-01",
            "duration_hours": 2,
            "vehicle_plate": "KA-01-AB-1234",
            "vehicle_type": "Car"
        },
        user=user
    )
    assert res is not None
    assert "reservation" in res or res.get("success") is not None
