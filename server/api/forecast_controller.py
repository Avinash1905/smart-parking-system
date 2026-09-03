"""
SmartPark Occupancy Forecast API Controller
Exposes multi-horizon statistical projections and peak congestion probabilities.
"""

from typing import Dict, Any
from server.services.business_services import ParkingService
from server.core.occupancy_forecaster import OccupancyForecaster

class ForecastController:
    @staticmethod
    def handle_forecast_request(zone_id: str) -> Dict[str, Any]:
        try:
            zone = ParkingService.get_zone_by_id(zone_id)
            if not zone:
                return {"success": False, "error": f"Parking zone with ID '{zone_id}' not found."}

            total_spaces = int(zone.get("total_spaces", 100))
            available = int(zone.get("available_spaces", 50))
            occupied = total_spaces - available

            forecast = OccupancyForecaster.forecast_zone_occupancy(
                zone_id=zone_id,
                total_spaces=total_spaces,
                current_occupied=occupied
            )

            return {
                "success": True,
                "zone_name": zone.get("name"),
                "forecast": forecast
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to compute occupancy forecast: {str(e)}"
            }
