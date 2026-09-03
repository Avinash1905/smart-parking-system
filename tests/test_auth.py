"""
Unit Tests for SmartPark Authentication & User Services
"""

import pytest
from server.services.business_services import AuthService

def test_user_authentication_success():
    res = AuthService.login("demo@smartpark.com", "SmartPark@123")
    assert res["success"] is True
    assert res["user"]["name"] == "Avinash Sharma"
    assert "token" in res

def test_user_authentication_failure():
    res = AuthService.login("non_existent_user@test.com", "wrong_password")
    assert res["success"] is False

def test_get_user_by_id():
    user = AuthService.get_user_by_id("usr-tcs-01")
    assert user is not None
    assert user["name"] == "Avinash Sharma"
    assert user["email"] == "demo@smartpark.com"
