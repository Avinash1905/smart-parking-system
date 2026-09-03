"""
SmartPark EV Battery Swap Cabinet Service
Coordinates automated 90-second battery locker unlocks for delivery couriers and commercial scooters.
"""

from typing import Dict, Any, List
from server.database.repositories.battery_swap_repository import BatterySwapRepository, BatterySwapCabinet

class BatterySwapService:
    @staticmethod
    def get_swap_cabinets() -> List[Dict[str, Any]]:
        cabs = BatterySwapRepository.list_all()
        if not cabs:
            sample = [
                BatterySwapCabinet(cabinet_code="BSS-CAB-01", charged_ready_batteries=9, charging_batteries=3),
                BatterySwapCabinet(cabinet_code="BSS-CAB-02", charged_ready_batteries=11, charging_batteries=1)
            ]
            for s in sample:
                BatterySwapRepository.create(s)
            cabs = BatterySwapRepository.list_all()

        return [c.to_dict() for c in cabs]
