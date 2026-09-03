"""
Unit Tests for SmartPark Violations & Enforcement Services
"""

import pytest
from server.services.business_services import ViolationService

def test_get_all_violations():
    viols = ViolationService.get_violations("ALL")
    assert isinstance(viols, list)

def test_violation_filter_by_status():
    open_viols = ViolationService.get_violations("PENDING")
    assert isinstance(open_viols, list)
    for v in open_viols:
        assert v.get("status") == "PENDING"
