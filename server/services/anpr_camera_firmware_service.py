"""
SmartPark ANPR Camera Optical Hardware Watchdog & Dew Heater Controller Service
Monitors RTSP video stream packet drop rates, controls optical lens heating elements
to prevent condensation in humid/winter conditions, and schedules firmware OTA deployments.
"""

from typing import Dict, List, Any
import math
from datetime import datetime

class ANPRCameraFirmwareService:
    CAMERAS = [
        {"cam_id": "CAM-GATE-NORTH-01", "location": "North Entrance Entry Lane 1", "rtsp_url": "rtsp://10.0.1.50:554/live/h265", "firmware_version": "v4.2.8", "lens_temp_c": 32.4, "dew_heater_active": False, "packet_loss_pct": 0.02},
        {"cam_id": "CAM-GATE-NORTH-02", "location": "North Entrance Entry Lane 2", "rtsp_url": "rtsp://10.0.1.51:554/live/h265", "firmware_version": "v4.2.8", "lens_temp_c": 31.8, "dew_heater_active": False, "packet_loss_pct": 0.00},
        {"cam_id": "CAM-GATE-SOUTH-01", "location": "South Metro Entrance Lane", "rtsp_url": "rtsp://10.0.1.52:554/live/h265", "firmware_version": "v4.2.8", "lens_temp_c": 28.5, "dew_heater_active": True, "packet_loss_pct": 0.05},
        {"cam_id": "CAM-GATE-EXIT-01", "location": "West Expressway Exit Ramp", "rtsp_url": "rtsp://10.0.1.53:554/live/h265", "firmware_version": "v4.2.8", "lens_temp_c": 33.1, "dew_heater_active": False, "packet_loss_pct": 0.01}
    ]

    @classmethod
    def evaluate_lens_dew_point(
        cls,
        ambient_temp_c: float = 18.0,
        relative_humidity_pct: float = 85.0
    ) -> Dict[str, Any]:
        """Calculates ambient dew point temperature using Magnus formula."""
        # Magnus formula parameters
        a = 17.27
        b = 237.7
        alpha = ((a * ambient_temp_c) / (b + ambient_temp_c)) + math.log(relative_humidity_pct / 100.0)
        dew_point_c = (b * alpha) / (a - alpha)

        # Trigger dew heater if lens temp is within 3°C of dew point
        heater_trigger_threshold_c = dew_point_c + 3.0

        return {
            "timestamp": datetime.now().isoformat(),
            "ambient_temp_c": ambient_temp_c,
            "relative_humidity_pct": relative_humidity_pct,
            "calculated_dew_point_c": round(dew_point_c, 2),
            "dew_heater_activation_threshold_c": round(heater_trigger_threshold_c, 2),
            "condensation_risk": "HIGH" if ambient_temp_c <= heater_trigger_threshold_c else "NOMINAL",
            "camera_fleet": cls.CAMERAS
        }
