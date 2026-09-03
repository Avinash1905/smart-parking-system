"""
SmartPark Wheel Boot Immobilization & Smart Padlock Release Service
Enforces parking violation clamp lockdowns and provides automated Bluetooth/PIN unclamp once fines are paid.
"""

from typing import Dict, Any, List
from server.database.repositories.wheel_boot_repository import WheelBootRepository, WheelBootEnforcement

class WheelBootService:
    @staticmethod
    def get_immobilized_vehicles() -> List[Dict[str, Any]]:
        boots = WheelBootRepository.list_all()
        if not boots:
            sample = [
                WheelBootEnforcement(boot_code="BOOT-CLAMP-08", vehicle_plate="KA-05-ZZ-9911", violation_reason="Habitual Overstay (> 48 Hours)", fine_amount_inr=1200.0, unlock_security_pin="7492")
            ]
            for s in sample:
                WheelBootRepository.create(s)
            boots = WheelBootRepository.list_all()

        return [b.to_dict() for b in boots]
