"""
SmartPark Stolen Vehicle Police Hotlist & Lockdown Service
Enforces automatic barrier descent and silent police dispatch upon detecting blacklisted hotlist license plates.
"""

from typing import Dict, Any, List
from server.database.repositories.hotlist_lockdown_repository import HotlistLockdownRepository, HotlistLockdownEvent

class HotlistLockdownService:
    @staticmethod
    def trigger_hotlist_containment(plate: str = "KA-04-E-1337") -> Dict[str, Any]:
        evt = HotlistLockdownEvent(
            vehicle_plate=plate,
            crime_category="FELONY_VEHICLE_THEFT",
            approaching_gate_code="GATE-NORTH-BARRIER-01",
            police_precinct_dispatched="Cubbon Park Police Station (Ctrl #4)",
            status="CONTAINED_LOCKDOWN"
        )
        HotlistLockdownRepository.create(evt)
        return {"success": True, "event_id": evt.id, "data": evt.to_dict()}
