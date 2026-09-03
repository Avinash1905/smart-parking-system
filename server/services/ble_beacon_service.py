"""
SmartPark Bluetooth Low Energy (BLE) Keyless Proximity Service
Evaluates driver smartphone distance and automatically opens barrier gates when vehicle approaches within 3 meters.
"""

from typing import Dict, Any, List
import math

class BLEBeaconService:
    @staticmethod
    def evaluate_proximity(rssi_dbm: float, tx_power: int = -59) -> Dict[str, Any]:
        # Approximate distance in meters: d = 10 ^ ((tx_power - rssi) / (10 * 2))
        ratio = (tx_power - rssi_dbm) / (10.0 * 2.0)
        distance_meters = round(math.pow(10, ratio), 1)

        is_near_barrier = distance_meters <= 3.0

        return {
            "rssi_dbm": rssi_dbm,
            "calculated_distance_meters": distance_meters,
            "proximity_zone": "IMMEDIATE_GATE" if is_near_barrier else "APPROACHING",
            "barrier_auto_lift_triggered": is_near_barrier
        }
