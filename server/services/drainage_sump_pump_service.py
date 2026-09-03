"""
SmartPark Stormwater Sump Pit & Duplex Pump Drainage Service
Monitors pit water level floats, controls lead/lag alternating pump cycles,
and tracks oil-water separation effluent before municipal storm drain discharge.
"""

from typing import Dict, List, Any
from datetime import datetime

class DrainageSumpPumpService:
    @staticmethod
    def evaluate_sump_status(
        pit_water_level_cm: float,
        pit_max_depth_cm: float = 300.0,
        oil_film_thickness_mm: float = 1.2,
        lead_pump_hours: float = 480.0
    ) -> Dict[str, Any]:
        """Controls duplex pump relays and evaluates flood risks."""
        level_pct = round((pit_water_level_cm / pit_max_depth_cm) * 100.0, 1)

        if level_pct >= 85.0:
            pump_state = "BOTH_PUMPS_RUNNING_EMERGENCY"
            alarm_status = "CRITICAL_HIGH_WATER_ALARM"
            discharge_rate_lpm = 1800
        elif level_pct >= 50.0:
            pump_state = "LEAD_PUMP_RUNNING"
            alarm_status = "NOMINAL_ACTIVE_DRAINAGE"
            discharge_rate_lpm = 900
        else:
            pump_state = "ALL_PUMPS_STANDBY"
            alarm_status = "NORMAL_LOW_LEVEL"
            discharge_rate_lpm = 0

        # Oil-water separator coalesce filter check (< 5.0 mm allowable)
        separator_state = "OIL_SKIMMER_ACTIVE" if oil_film_thickness_mm >= 3.0 else "CLEAR_EFFLUENT"

        return {
            "timestamp": datetime.now().isoformat(),
            "pit_water_level_cm": pit_water_level_cm,
            "fill_percentage": level_pct,
            "pump_operational_state": pump_state,
            "alarm_condition": alarm_status,
            "discharge_flow_lpm": discharge_rate_lpm,
            "oil_water_separator": {
                "oil_thickness_mm": oil_film_thickness_mm,
                "separator_status": separator_state,
                "hydrocarbon_ppm": 4.2  # Below 15 ppm statutory limit
            },
            "pump_alternation_lead": "PUMP_A" if int(lead_pump_hours) % 2 == 0 else "PUMP_B"
        }
