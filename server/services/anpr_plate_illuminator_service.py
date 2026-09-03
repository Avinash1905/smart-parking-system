"""
SmartPark ANPR High-Intensity Infrared Strobe Illuminator Service
Controls optical strobe flash pulse width, infrared (850nm / 940nm) illuminator brightness,
and synchronizes camera electronic rolling shutters with license plate retro-reflective characteristics.
"""

from typing import Dict, List, Any
import math
from datetime import datetime

class ANPRPlateIlluminatorService:
    @staticmethod
    def calculate_illumination_parameters(
        ambient_lux: float,
        vehicle_speed_kmh: float,
        target_distance_meters: float = 6.5,
        retroreflective_gain: float = 2.8
    ) -> Dict[str, Any]:
        """Dynamically tunes infrared illuminator LED pulse width and current."""
        # Higher vehicle speed requires faster shutter to avoid optical motion blur
        max_blur_pixels = 1.5
        # 1 km/h = 0.2778 m/s
        speed_mps = vehicle_speed_kmh * 0.2778
        exposure_time_us = min(2000.0, max(250.0, (max_blur_pixels * 0.005) / max(0.1, speed_mps) * 1000000.0))

        # Inverse square law for optical irradiance
        irradiance_factor = math.pow(target_distance_meters / 5.0, 2.0)
        
        # Adaptive LED drive current
        if ambient_lux < 10.0:
            drive_current_ma = min(1500.0, 800.0 * irradiance_factor / retroreflective_gain)
            ir_wavelength_nm = 850  # 850nm semi-covert for high sensitivity
            strobe_mode = "HIGH_POWER_PULSE"
        elif ambient_lux < 250.0:
            drive_current_ma = min(1000.0, 400.0 * irradiance_factor / retroreflective_gain)
            ir_wavelength_nm = 850
            strobe_mode = "ADAPTIVE_FILL"
        else:
            drive_current_ma = 0.0  # Daylight sufficient
            ir_wavelength_nm = 940  # 940nm covert fallback
            strobe_mode = "DAYLIGHT_STANDBY"

        return {
            "timestamp": datetime.now().isoformat(),
            "ambient_lux": ambient_lux,
            "vehicle_speed_kmh": vehicle_speed_kmh,
            "shutter_speed_microseconds": round(exposure_time_us, 1),
            "led_drive_current_milliamps": round(drive_current_ma, 1),
            "infrared_wavelength_nm": ir_wavelength_nm,
            "strobe_operating_mode": strobe_mode,
            "estimated_image_contrast_ratio": 32.5,
            "plate_blooming_prevention_filter": "POLARIZED_ACTIVE"
        }
