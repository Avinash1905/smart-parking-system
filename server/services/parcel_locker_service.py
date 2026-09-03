"""
SmartPark Smart Parcel Delivery Locker Bay Service
Coordinates OTP pickup pins and automated electromagnetic locker door releases for parked motorists.
"""

from typing import Dict, Any, List
from server.database.repositories.parcel_locker_repository import ParcelLockerRepository, ParcelLockerBox

class ParcelLockerService:
    @staticmethod
    def get_user_lockers(user_id: str = "usr-882") -> List[Dict[str, Any]]:
        lockers = ParcelLockerRepository.list_all()
        if not lockers:
            sample = [
                ParcelLockerBox(locker_code="BOX-B1-08", carrier_name="FedEx Express", tracking_number="748920194812", pickup_otp_pin="482910")
            ]
            for s in sample:
                ParcelLockerRepository.create(s)
            lockers = ParcelLockerRepository.list_all()

        return [l.to_dict() for l in lockers]
