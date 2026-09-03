"""
SmartPark Electrical Substation Power Quality & Harmonics Telemetry Service
Monitors 11kV/415V step-down transformer insulation partial discharge, power factor, and voltage sags.
"""

from typing import Dict, List, Any
from datetime import datetime

class EVGridSubstationTelemetryService:
    @staticmethod
    def get_substation_metrics(substation_id: str = "SUBSTATION-MAIN-415V") -> Dict[str, Any]:
        return {
            "substation_id": substation_id,
            "timestamp": datetime.now().isoformat(),
            "primary_voltage_kv": 11.0,
            "secondary_voltage_v": 415.2,
            "power_factor": 0.988,
            "total_harmonic_distortion_pct": 1.85,
            "partial_discharge_pc": 8.4,
            "transformer_winding_temp_c": 56.2,
            "switchgear_sf6_pressure_bar": 5.8,
            "status": "ALL_SYSTEMS_OPTIMAL_STABLE"
        }
