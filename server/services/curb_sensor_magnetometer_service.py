"""
SmartPark Wireless Curb Magnetometer IoT Sensor Telemetry Service
Decodes 3-axis (X, Y, Z) Earth magnetic field perturbation telemetry from surface-mount
puck magnetometers installed on street curbs, detecting vehicle arrival with zero pavement trenching.
"""

from typing import Dict, List, Any
import math
from datetime import datetime

class CurbSensorMagnetometerService:
    @staticmethod
    def process_geomagnetic_telemetry(
        sensor_id: str,
        mag_x_microtesla: float,
        mag_y_microtesla: float,
        mag_z_microtesla: float,
        baseline_z_microtesla: float = 42.0,
        battery_millivolts: int = 3600
    ) -> Dict[str, Any]:
        """Calculates total magnetic flux vector deviation caused by ferrous vehicle mass."""
        delta_z = abs(mag_z_microtesla - baseline_z_microtesla)
        total_field_magnitude = math.sqrt(mag_x_microtesla**2 + mag_y_microtesla**2 + mag_z_microtesla**2)
        
        # Vehicle presence detected if delta_z > 8.0 microtesla
        is_vehicle_present = delta_z >= 8.0

        return {
            "sensor_id": sensor_id,
            "timestamp": datetime.now().isoformat(),
            "raw_flux": {"x": mag_x_microtesla, "y": mag_y_microtesla, "z": mag_z_microtesla},
            "total_magnetic_field_ut": round(total_field_magnitude, 2),
            "ferrous_perturbation_delta_z": round(delta_z, 2),
            "vehicle_detected": is_vehicle_present,
            "bay_state": "OCCUPIED" if is_vehicle_present else "AVAILABLE",
            "battery_millivolts": battery_millivolts,
            "battery_estimated_lifetime_years": 8.5
        }
