"""
SmartPark Underground HVAC & Variable Frequency Drive (VFD) Air Scrubber Service
Monitors exhaust toxic carbon monoxide and nitrogen dioxide gas concentration curves,
adjusting ventilation induction fans dynamically to maintain ASHRAE 62.1 indoor air standards.
"""

from typing import Dict, List, Any
import math
from datetime import datetime

class HVACAirScrubberVFDService:
    FAN_BANKS = [
        {"bank_id": "VFD-B1-NORTH", "floor": "B1", "rating_cfm": 25000, "current_hz": 42.0, "status": "ACTIVE"},
        {"bank_id": "VFD-B1-SOUTH", "floor": "B1", "rating_cfm": 25000, "current_hz": 40.0, "status": "ACTIVE"},
        {"bank_id": "VFD-B2-NORTH", "floor": "B2", "rating_cfm": 30000, "current_hz": 48.0, "status": "ACTIVE"},
        {"bank_id": "VFD-B2-SOUTH", "floor": "B2", "rating_cfm": 30000, "current_hz": 48.0, "status": "ACTIVE"}
    ]

    @classmethod
    def calculate_ventilation_demand(
        cls,
        co_ppm: float,
        no2_ppm: float,
        temperature_c: float = 24.5,
        relative_humidity_pct: float = 58.0
    ) -> Dict[str, Any]:
        """Calculates optimal VFD inverter frequency to flush toxic exhaust gases with minimal energy use."""
        
        # ASHRAE standard: CO < 25 ppm, NO2 < 0.2 ppm
        if co_ppm > 40.0 or no2_ppm > 0.40:
            target_hz = 60.0  # Max turbo exhaust
            operational_mode = "EMERGENCY_PURGE_TURBO"
            damper_position_pct = 100
        elif co_ppm > 20.0 or no2_ppm > 0.15:
            target_hz = 48.0  # High exhaust
            operational_mode = "ELEVATED_POLLUTION_MODULATION"
            damper_position_pct = 80
        elif co_ppm > 10.0:
            target_hz = 35.0  # Standard continuous circulation
            operational_mode = "STANDARD_CIRCULATION"
            damper_position_pct = 50
        else:
            target_hz = 20.0  # Low-energy economy trickle
            operational_mode = "ECO_STANDBY_TRICKLE"
            damper_position_pct = 30

        # Fan affinity laws: Power proportional to cube of speed (Hz^3)
        nominal_power_kw = 18.5  # Per fan at 60 Hz
        current_power_per_fan_kw = round(nominal_power_kw * math.pow(target_hz / 60.0, 3.0), 2)
        total_facility_vent_power_kw = round(current_power_per_fan_kw * len(cls.FAN_BANKS), 2)

        return {
            "timestamp": datetime.now().isoformat(),
            "sensor_readings": {
                "co_ppm": co_ppm,
                "no2_ppm": no2_ppm,
                "ambient_temp_c": temperature_c,
                "relative_humidity": relative_humidity_pct
            },
            "ventilation_action": {
                "operating_mode": operational_mode,
                "target_inverter_frequency_hz": target_hz,
                "intake_damper_opening_pct": damper_position_pct,
                "total_cfm_airflow": int(110000 * (target_hz / 60.0)),
                "total_power_consumption_kw": total_facility_vent_power_kw
            },
            "fan_banks": cls.FAN_BANKS
        }
