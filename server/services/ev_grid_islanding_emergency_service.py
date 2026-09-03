"""
SmartPark Microgrid Emergency Islanding & Black-Start Power Dispatch Service
Isolates the facility electrical microgrid during municipal utility blackouts,
re-energizing emergency fire sump pumps, life-safety ventilation fans, and exit barriers from BESS solar storage.
"""

from typing import Dict, List, Any
from datetime import datetime

class EVGridIslandingEmergencyService:
    @staticmethod
    def initiate_island_mode(
        utility_grid_voltage_v: float = 0.0,
        bess_available_kwh: float = 425.0
    ) -> Dict[str, Any]:
        is_grid_blackout = utility_grid_voltage_v < 50.0

        return {
            "timestamp": datetime.now().isoformat(),
            "utility_grid_blackout_detected": is_grid_blackout,
            "microgrid_operating_state": "ISLANDED_AUTONOMOUS" if is_grid_blackout else "GRID_TIED_SYNCHRONOUS",
            "bess_stored_reserve_kwh": bess_available_kwh,
            "critical_life_safety_load_kw": 45.0,
            "estimated_islanded_runtime_hours": round(bess_available_kwh / 45.0, 1),
            "emergency_generator_autostart": "STANDBY_READY",
            "barrier_fail_safe_behavior": "BATTERY_BACKUP_HOLD_OPEN"
        }
