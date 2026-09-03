"""
Unit Tests for SmartPark ML Prediction & Analytics Services
"""

import pytest
from server.services.business_services import PredictionService, RecommendationService, AuthService

def test_occupancy_prediction_calculation():
    pred = PredictionService.calculate_prediction("zone-pub-01")
    assert pred is not None
    assert "current_occupancy_percent" in pred
    assert 0 <= pred["current_occupancy_percent"] <= 100

def test_smart_recommendations():
    user = AuthService.get_user_by_id("usr-tcs-01")
    recs = RecommendationService.get_top_recommendations(user)
    assert isinstance(recs, list)
    assert len(recs) > 0
    assert "zone_name" in recs[0]
    assert "match_percentage" in recs[0]
