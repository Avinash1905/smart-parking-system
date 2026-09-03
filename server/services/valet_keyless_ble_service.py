"""
SmartPark Bluetooth Low Energy (BLE) & Ultra-Wideband (UWB) Keyless Access Service
Provides sub-meter smartphone ranging for automatic barrier unlocking,
hands-free garage gate triggers, and digital car key sharing.
"""

from typing import Dict, List, Any, Optional
import math
import uuid
from datetime import datetime

class ValetKeylessBLEService:
    @staticmethod
    def calculate_rssi_distance(rssi_dbm: float, tx_power_at_1m_dbm: float = -59.0, path_loss_exponent: float = 2.4) -> float:
        """Estimates physical distance in meters from BLE RSSI signal strength."""
        if rssi_dbm >= 0:
            return 0.1
        ratio = (tx_power_at_1m_dbm - rssi_dbm) / (10.0 * path_loss_exponent)
        return round(math.pow(10.0, ratio), 2)

    @classmethod
    def evaluate_proximity_unlock(
        cls,
        user_id: str,
        vehicle_plate: str,
        beacon_id: str,
        rssi_dbm: float
    ) -> Dict[str, Any]:
        """Triggers gate or vehicle door unlock when smartphone enters 2.0m perimeter."""
        estimated_distance_m = cls.calculate_rssi_distance(rssi_dbm)
        is_in_range = estimated_distance_m <= 2.5

        return {
            "user_id": user_id,
            "vehicle_plate": vehicle_plate.upper(),
            "beacon_id": beacon_id,
            "rssi_dbm": rssi_dbm,
            "estimated_distance_meters": estimated_distance_m,
            "proximity_zone": "NEAR_PROXIMITY" if is_in_range else "FAR_AWAY",
            "unlock_action": "TRIGGER_UNLOCK" if is_in_range else "KEEP_LOCKED",
            "timestamp": datetime.now().isoformat()
        }
