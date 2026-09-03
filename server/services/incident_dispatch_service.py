"""
SmartPark Security & Emergency Incident Response Dispatch Service
Coordinates SOS panic button activations, intercom calls, fire sensor alerts,
and automated emergency corridor clearings for first responders.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime

_ACTIVE_INCIDENTS: Dict[str, Dict[str, Any]] = {
    "INC-901": {
        "incident_id": "INC-901",
        "severity": "MEDIUM",
        "category": "BLOCKED_DRIVEWAY",
        "zone_id": "zone-pub-01",
        "location": "Aisle B2 Near Ramp East",
        "reported_at": "2026-09-03T10:15:00",
        "reporter": "Patrol Officer #02",
        "status": "DISPATCHED",
        "assigned_patrol_officer": "Officer K. Rao",
        "notes": "Delivery van double-parked obstructing two-way flow."
    }
}

class IncidentDispatchService:
    @staticmethod
    def report_incident(
        category: str,
        zone_id: str,
        location: str,
        severity: str = "MEDIUM",
        reporter: str = "Driver / Mobile App",
        notes: str = ""
    ) -> Dict[str, Any]:
        inc_id = f"INC-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now()

        incident = {
            "incident_id": inc_id,
            "severity": severity.upper(),
            "category": category.upper(),
            "zone_id": zone_id,
            "location": location,
            "reported_at": now.isoformat(),
            "reporter": reporter,
            "status": "DISPATCHED" if severity.upper() in ["HIGH", "CRITICAL"] else "OPEN",
            "assigned_patrol_officer": "Quick Response Team Alpha" if severity.upper() in ["HIGH", "CRITICAL"] else "Station Guard",
            "notes": notes
        }

        _ACTIVE_INCIDENTS[inc_id] = incident
        return {"success": True, "incident": incident}

    @staticmethod
    def resolve_incident(incident_id: str, resolution_notes: str) -> Dict[str, Any]:
        if incident_id not in _ACTIVE_INCIDENTS:
            return {"success": False, "message": "Incident record not found"}

        inc = _ACTIVE_INCIDENTS[incident_id]
        inc["status"] = "RESOLVED"
        inc["resolved_at"] = datetime.now().isoformat()
        inc["resolution_notes"] = resolution_notes
        return {"success": True, "incident": inc}

    @staticmethod
    def list_incidents(status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        if status_filter:
            return [inc for inc in _ACTIVE_INCIDENTS.values() if inc["status"] == status_filter.upper()]
        return list(_ACTIVE_INCIDENTS.values())
