"""
SmartPark Stolen Bicycle & Anti-Theft Frame Registry Service
Protects two-wheeler pedal and electric bicycles parked in facility racks via RFID and serial registration.
"""

from typing import Dict, Any, List
from server.database.repositories.bicycle_registry_repository import BicycleRegistryRepository, BicycleRegistration

class BicycleRegistryService:
    @staticmethod
    def get_registered_bicycles() -> List[Dict[str, Any]]:
        bikes = BicycleRegistryRepository.list_all()
        if not bikes:
            sample = [
                BicycleRegistration(frame_serial_number="TREK-SN-8829104", owner_name="Kavita Rao", bicycle_make_model="Trek Marlin 7 Hardtail MTB", rfid_tag_id="RFID-BIKE-4401")
            ]
            for s in sample:
                BicycleRegistryRepository.create(s)
            bikes = BicycleRegistryRepository.list_all()

        return [b.to_dict() for b in bikes]
