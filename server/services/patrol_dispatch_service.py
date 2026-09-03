"""
SmartPark Municipal Patrol Dispatch & Officer Beat Service Layer
Coordinates officer routes, handles incident dispatches, and tracks live handheld battery/GPS.
"""

from typing import Dict, Any, List
from server.database.repositories.patrol_officer_repository import PatrolOfficerRepository, PatrolOfficer

class PatrolDispatchService:
    @staticmethod
    def get_patrol_roster() -> List[Dict[str, Any]]:
        officers = PatrolOfficerRepository.list_all()
        if not officers:
            seeds = [
                PatrolOfficer(badge_number="OFFICER-704", name="Vikas Gowda", assigned_zone_id="zone-pub-01", assigned_zone_name="Municipal Central & CBD", handheld_device_id="POS-TAB-902", citations_issued_today=3, patrol_status="ON_PATROL"),
                PatrolOfficer(badge_number="OFFICER-812", name="Kiran Reddy", assigned_zone_id="zone-pub-04", assigned_zone_name="Brigade Road Corridor", handheld_device_id="POS-TAB-905", citations_issued_today=5, patrol_status="ON_PATROL"),
                PatrolOfficer(badge_number="OFFICER-920", name="Priyanka Sen", assigned_zone_id="zone-pvt-01", assigned_zone_name="Electronic City Tech Gate", handheld_device_id="POS-TAB-918", citations_issued_today=1, patrol_status="ON_BREAK")
            ]
            for s in seeds:
                PatrolOfficerRepository.create(s)
            officers = PatrolOfficerRepository.list_all()

        return [o.to_dict() for o in officers]
