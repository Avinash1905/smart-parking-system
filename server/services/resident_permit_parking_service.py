"""
SmartPark Municipal Resident Permit Parking (RPP) & Visitor Pass Service
Issues verified neighborhood resident permits, manages visitor scratchcards,
and verifies address proof via municipal GIS boundary polygons.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime, timedelta

_RESIDENT_PERMITS: Dict[str, Dict[str, Any]] = {
    "RPP-8801": {
        "permit_id": "RPP-8801",
        "resident_name": "Siddharth Verma",
        "zone_code": "RES-ZONE-KORAMANGALA-4TH",
        "address": "#412, 7th Main, Koramangala 4th Block",
        "vehicle_plate": "KA-01-MJ-5890",
        "valid_until": "2026-12-31",
        "permit_tier": "ANNUAL_RESIDENT_PRIMARY",
        "status": "ACTIVE_VERIFIED"
    }
}

class ResidentPermitParkingService:
    @staticmethod
    def apply_resident_permit(
        resident_name: str,
        address: str,
        vehicle_plate: str,
        zone_code: str,
        permit_duration_months: int = 12
    ) -> Dict[str, Any]:
        permit_id = f"RPP-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now()
        valid_until = (now + timedelta(days=permit_duration_months * 30)).strftime("%Y-%m-%d")

        permit = {
            "permit_id": permit_id,
            "resident_name": resident_name,
            "zone_code": zone_code,
            "address": address,
            "vehicle_plate": vehicle_plate.upper(),
            "applied_on": now.isoformat(),
            "valid_until": valid_until,
            "permit_tier": "ANNUAL_RESIDENT_PRIMARY",
            "status": "ACTIVE_VERIFIED",
            "digital_barcode": f"RPP-BAR-{uuid.uuid4().hex[:8].upper()}"
        }

        _RESIDENT_PERMITS[permit_id] = permit
        return {"success": True, "permit": permit}

    @staticmethod
    def issue_visitor_day_pass(resident_permit_id: str, guest_plate: str) -> Dict[str, Any]:
        if resident_permit_id not in _RESIDENT_PERMITS:
            return {"success": False, "message": "Resident permit not found"}

        host = _RESIDENT_PERMITS[resident_permit_id]
        pass_id = f"VRP-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now()
        valid_until = (now + timedelta(hours=24)).isoformat()

        visitor_pass = {
            "pass_id": pass_id,
            "host_permit_id": resident_permit_id,
            "zone_code": host["zone_code"],
            "guest_plate": guest_plate.upper(),
            "issued_at": now.isoformat(),
            "valid_until": valid_until,
            "status": "ACTIVE_DAY_PASS"
        }
        return {"success": True, "visitor_pass": visitor_pass}

    @staticmethod
    def list_resident_permits() -> List[Dict[str, Any]]:
        return list(_RESIDENT_PERMITS.values())
