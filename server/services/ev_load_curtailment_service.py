"""
SmartPark EV Active Grid Frequency Response & Load Curtailment Service
Participates in automated demand-response (ADR) events with regional power utilities,
throttling high-power DC fast chargers during grid frequency dips (<49.85 Hz) to earn capacity payments.
"""

from typing import Dict, List, Any
from datetime import datetime

class EVLoadCurtailmentService:
    @staticmethod
    def evaluate_grid_frequency_response(
        grid_frequency_hz: float = 49.92,
        active_ev_load_kw: float = 180.0,
        nominal_frequency_hz: float = 50.00
    ) -> Dict[str, Any]:
        """Calculates automated curtailment factor to support grid stabilization."""
        delta_f = nominal_frequency_hz - grid_frequency_hz

        if delta_f >= 0.15:  # Serious grid stress (f <= 49.85 Hz)
            curtailment_pct = 60.0
            response_mode = "GRID_FREQUENCY_EMERGENCY_CURTAILMENT"
            compensation_rate_per_kwh_curtailed = 18.50
        elif delta_f >= 0.05:  # Moderate under-frequency (f <= 49.95 Hz)
            curtailment_pct = 25.0
            response_mode = "DEMAND_RESPONSE_BALANCING"
            compensation_rate_per_kwh_curtailed = 12.00
        else:
            curtailment_pct = 0.0
            response_mode = "NORMAL_GRID_UNCONSTRAINED"
            compensation_rate_per_kwh_curtailed = 0.0

        shaved_kw = round(active_ev_load_kw * (curtailment_pct / 100.0), 2)
        allowed_ev_load_kw = round(active_ev_load_kw - shaved_kw, 2)

        return {
            "timestamp": datetime.now().isoformat(),
            "grid_frequency_hz": grid_frequency_hz,
            "nominal_target_hz": nominal_frequency_hz,
            "frequency_deviation_hz": round(delta_f, 3),
            "response_mode": response_mode,
            "curtailment_percentage": curtailment_pct,
            "active_ev_load_original_kw": active_ev_load_kw,
            "curtailed_power_kw": shaved_kw,
            "allowed_dispatched_ev_power_kw": allowed_ev_load_kw,
            "earned_demand_response_revenue_inr": round(shaved_kw * compensation_rate_per_kwh_curtailed, 2)
        }
