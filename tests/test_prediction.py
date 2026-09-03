"""
Unit Tests for SmartPark Dynamic AI Prediction and Smart Bay Recommendation.
"""

import unittest
from server.services.business_services import PredictionService, RecommendationService

class TestPredictionService(unittest.TestCase):
    def test_prediction_engine_output(self):
        pred_data = PredictionService.calculate_prediction("zone-pub-01")
        self.assertIn("zone_id", pred_data)
        self.assertIn("current_occupancy_percent", pred_data)
        self.assertIn("confidence_score", pred_data)
        self.assertIn("trend", pred_data)
        self.assertGreaterEqual(pred_data["current_occupancy_percent"], 0)
        self.assertLessEqual(pred_data["current_occupancy_percent"], 100)

    def test_recommendation_engine_output(self):
        recs = RecommendationService.get_top_recommendations()
        self.assertIsInstance(recs, list)
        self.assertGreater(len(recs), 0)
        self.assertIn("match_percentage", recs[0])
        self.assertIn("zone_name", recs[0])

if __name__ == "__main__":
    unittest.main()
