"""
SmartPark Valet Staff Runner Dispatch Scheduling Service
Assigns vehicle retrieval tasks to valet drivers based on shortest walking paths,
runner fatigue metrics, and incoming customer proximity alerts.
"""

from typing import Dict, List, Any, Optional
import math
from datetime import datetime

class ValetDispatchSchedulerService:
    RUNNERS = [
        {"runner_id": "RUN-01", "name": "Deepak V.", "current_pos_x": 20.0, "current_pos_y": 50.0, "floor": 0, "active_tasks": 0, "status": "AVAILABLE"},
        {"runner_id": "RUN-02", "name": "Sameer K.", "current_pos_x": 75.0, "current_pos_y": 80.0, "floor": 1, "active_tasks": 1, "status": "RETRIEVING"},
        {"runner_id": "RUN-03", "name": "Mohan R.", "current_pos_x": 50.0, "current_pos_y": 20.0, "floor": 0, "active_tasks": 0, "status": "AVAILABLE"}
    ]

    @classmethod
    def dispatch_best_runner(cls, bay_x: float, bay_y: float, bay_floor: int) -> Dict[str, Any]:
        """Selects the single most optimal runner minimizing pedestrian transit latency."""
        available_runners = [r for r in cls.RUNNERS if r["status"] == "AVAILABLE"]
        if not available_runners:
            available_runners = cls.RUNNERS  # Fallback to least busy

        best_runner = None
        min_cost = float('inf')

        for r in available_runners:
            floor_diff = abs(r["floor"] - bay_floor) * 20.0
            dist = math.sqrt((r["current_pos_x"] - bay_x)**2 + (r["current_pos_y"] - bay_y)**2)
            cost = dist + floor_diff + (r["active_tasks"] * 50.0)
            if cost < min_cost:
                min_cost = cost
                best_runner = r

        estimated_reach_seconds = max(15, round(min_cost * 0.7))

        return {
            "timestamp": datetime.now().isoformat(),
            "assigned_runner": best_runner["name"],
            "runner_id": best_runner["runner_id"],
            "estimated_time_to_car_seconds": estimated_reach_seconds,
            "target_bay_coordinates": {"x": bay_x, "y": bay_y, "floor": bay_floor},
            "dispatch_status": "RUNNER_DISPATCHED"
        }
