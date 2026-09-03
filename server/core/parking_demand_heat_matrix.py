"""
SmartPark Urban Parking Demand 2D Spatial Heat Matrix Generator
Generates micro-grid spatial heat density maps representing urban parking saturation and curb turnover velocity.
"""

from typing import Dict, List, Any
from datetime import datetime

class ParkingDemandHeatMatrix:
    @staticmethod
    def generate_city_heat_grid(grid_resolution: int = 5) -> Dict[str, Any]:
        """Generates a 5x5 spatial grid matrix with localized congestion intensity coefficients (0.0 to 1.0)."""
        heat_cells = []
        center_lat = 12.9716
        center_lon = 77.5946

        # Generate 25 localized urban micro-cells across commercial corridors
        for row in range(grid_resolution):
            for col in range(grid_resolution):
                cell_lat = center_lat + ((row - 2) * 0.015)
                cell_lon = center_lon + ((col - 2) * 0.015)

                # Simulate dynamic density based on proximity to center
                dist_from_core = abs(row - 2) + abs(col - 2)
                intensity = round(max(0.15, 0.95 - (dist_from_core * 0.18)), 2)

                if intensity >= 0.80:
                    status_label = "SEVERE_CONGESTION"
                    color_hex = "#ef4444"
                elif intensity >= 0.55:
                    status_label = "HIGH_DEMAND"
                    color_hex = "#f59e0b"
                elif intensity >= 0.35:
                    status_label = "MODERATE_FLOW"
                    color_hex = "#3b82f6"
                else:
                    status_label = "LOW_DENSITY"
                    color_hex = "#10b981"

                heat_cells.append({
                    "cell_id": f"GRID-R{row}C{col}",
                    "row": row,
                    "col": col,
                    "latitude": round(cell_lat, 4),
                    "longitude": round(cell_lon, 4),
                    "saturation_intensity": intensity,
                    "status_label": status_label,
                    "color_hex": color_hex,
                    "average_turnover_velocity": f"{round(intensity * 4.2, 1)} vehicles/hr"
                })

        return {
            "grid_resolution": f"{grid_resolution}x{grid_resolution}",
            "generated_timestamp": datetime.utcnow().isoformat(),
            "total_cells": len(heat_cells),
            "heat_cells": heat_cells,
            "overall_urban_pressure_index": 0.72
        }
