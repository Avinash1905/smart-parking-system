"""
SmartPark Multi-Objective Bay Allocation Optimizer
Optimizes parking spot allocation by scoring available bays against vehicle attributes,
driver accessibility requirements, walking distance, and EV charging readiness.
"""

import math
from typing import Dict, List, Any, Optional

class BayAllocationOptimizer:
    @staticmethod
    def score_bay(
        bay: Dict[str, Any],
        vehicle_type: str = "SEDAN",
        requires_ev: bool = False,
        requires_accessible_ada: bool = False,
        preferred_floor: Optional[int] = None,
        target_destination: str = "ELEVATOR_LOBBY"
    ) -> float:
        """Scores an individual bay from 0 to 100 based on user requirements."""
        if bay.get("status") != "AVAILABLE":
            return -1.0

        score = 60.0  # Base feasibility baseline

        slot_type = bay.get("slot_type", "STANDARD").upper()

        # EV compatibility
        if requires_ev:
            if "EV" in slot_type:
                score += 30.0
            else:
                return -1.0  # Ineligible if EV is strictly requested
        else:
            # Penalty for parking non-EV in EV bay to preserve EV capacity
            if "EV" in slot_type:
                score -= 25.0

        # ADA Accessible requirement
        if requires_accessible_ada:
            if "ADA" in slot_type or "ACCESSIBLE" in slot_type:
                score += 35.0
            else:
                score -= 20.0
        else:
            if "ADA" in slot_type:
                score -= 30.0  # Avoid assigning ADA bay to standard driver

        # Vehicle size compatibility
        if vehicle_type.upper() in ["SUV", "TRUCK"]:
            if "COMPACT" in slot_type:
                return -1.0  # Will not fit
            elif "WIDE" in slot_type or "PREMIUM" in slot_type:
                score += 15.0
        elif vehicle_type.upper() == "MOTORCYCLE":
            if "BIKE" in slot_type or "TWO_WHEELER" in slot_type:
                score += 25.0

        # Floor preference
        bay_floor = int(bay.get("floor", 0))
        if preferred_floor is not None:
            floor_diff = abs(bay_floor - preferred_floor)
            score -= (floor_diff * 10.0)
        else:
            # Lower floors are naturally preferred
            score -= (bay_floor * 4.0)

        # Distance to elevator/entry
        distance_meters = float(bay.get("distance_to_exit_meters", 35.0))
        score += max(0.0, 20.0 - (distance_meters * 0.25))

        return max(0.0, min(100.0, score))

    @classmethod
    def find_optimal_bay(
        cls,
        available_bays: List[Dict[str, Any]],
        vehicle_type: str = "SEDAN",
        requires_ev: bool = False,
        requires_accessible_ada: bool = False,
        preferred_floor: Optional[int] = None
    ) -> Optional[Dict[str, Any]]:
        """Selects the single highest-scoring available parking bay."""
        scored_bays = []
        for bay in available_bays:
            score = cls.score_bay(
                bay,
                vehicle_type=vehicle_type,
                requires_ev=requires_ev,
                requires_accessible_ada=requires_accessible_ada,
                preferred_floor=preferred_floor
            )
            if score > 0:
                scored_bays.append((score, bay))

        if not scored_bays:
            return None

        # Sort descending by allocation score
        scored_bays.sort(key=lambda x: x[0], reverse=True)
        best_score, best_bay = scored_bays[0]

        result = dict(best_bay)
        result["allocation_fit_score"] = round(best_score, 1)
        return result
