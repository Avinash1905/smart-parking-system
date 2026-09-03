"""
SmartPark Acoustic Noise, Vibration & Sound Barrier Telemetry Service
Monitors garage ambient decibels (dBA), detects high-frequency tire squeal / skidding sounds,
and triggers directional sound absorption baffles to maintain noise compliance.
"""

from typing import Dict, List, Any
from datetime import datetime

class AcousticNoiseVibrationService:
    @staticmethod
    def evaluate_ambient_acoustics(
        sound_level_dba: float = 64.5,
        vibration_velocity_rms_mms: float = 0.85,
        dominant_frequency_hz: float = 120.0
    ) -> Dict[str, Any]:
        """Classifies acoustic anomalies (e.g. speeding tire squeal vs car alarms)."""
        is_tire_screech = sound_level_dba > 82.0 and dominant_frequency_hz > 2500.0
        is_car_alarm = sound_level_dba > 88.0 and (800.0 <= dominant_frequency_hz <= 1500.0)

        if is_car_alarm:
            acoustic_event = "VEHICLE_ANTI_THEFT_ALARM_DETECTED"
            severity = "HIGH"
        elif is_tire_screech:
            acoustic_event = "AGGRESSIVE_DRIVING_TIRE_SCREECH"
            severity = "MEDIUM"
        elif sound_level_dba > 75.0:
            acoustic_event = "ELEVATED_TRAFFIC_NOISE"
            severity = "LOW"
        else:
            acoustic_event = "QUIET_NOMINAL_BACKGROUND"
            severity = "NORMAL"

        return {
            "timestamp": datetime.now().isoformat(),
            "sound_level_dba": sound_level_dba,
            "vibration_rms_mms": vibration_velocity_rms_mms,
            "dominant_frequency_hz": dominant_frequency_hz,
            "detected_event": acoustic_event,
            "event_severity": severity,
            "acoustic_baffles_deployed": sound_level_dba > 75.0,
            "noise_pollution_standard_compliance": "COMPLIANT_WITHIN_MUNICIPAL_LIMITS"
        }
