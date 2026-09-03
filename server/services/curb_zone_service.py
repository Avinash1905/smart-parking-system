"""
SmartPark Dynamic Variable Curb Management Service
Coordinates time-of-day multi-use curb regulations to prevent delivery truck double-parking.
"""

from typing import Dict, Any, List
from server.database.repositories.curb_zone_repository import CurbZoneRepository, DynamicCurbSpace

class CurbZoneService:
    @staticmethod
    def get_curb_zones() -> List[Dict[str, Any]]:
        curbs = CurbZoneRepository.list_all()
        if not curbs:
            sample = [
                DynamicCurbSpace(curb_code="CURB-MG-01", street_name="MG Road Boulevard", current_time_window="08:00 - 11:00 AM", active_curb_policy="COMMERCIAL_FREIGHT_LOADING", max_dwell_minutes=30),
                DynamicCurbSpace(curb_code="CURB-INDIRA-02", street_name="100ft Road Indiranagar", current_time_window="11:00 AM - 06:00 PM", active_curb_policy="SHORT_STAY_PARKING", max_dwell_minutes=60)
            ]
            for s in sample:
                CurbZoneRepository.create(s)
            curbs = CurbZoneRepository.list_all()

        return [c.to_dict() for c in curbs]
