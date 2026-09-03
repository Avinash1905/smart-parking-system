"""
SmartPark Contractor & Logistics Loading Bay Management Service
Handles vendor delivery slots, heavy goods vehicle (HGV) height clearance validation,
and facility maintenance permit approvals.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime, timedelta

_CONTRACTOR_PERMITS: Dict[str, Dict[str, Any]] = {}

class ContractorPermitService:
    @staticmethod
    def apply_permit(
        company_name: str,
        contractor_name: str,
        vehicle_plate: str,
        vehicle_height_meters: float,
        purpose: str,
        loading_bay_id: str = "BAY-LOAD-01",
        start_time: Optional[str] = None,
        duration_hours: float = 2.0
    ) -> Dict[str, Any]:
        # Clearance check (e.g. basement loading dock limit is 3.8m)
        max_dock_clearance = 3.8
        if vehicle_height_meters > max_dock_clearance:
            return {
                "success": False,
                "message": f"Vehicle height ({vehicle_height_meters}m) exceeds loading dock max clearance of {max_dock_clearance}m."
            }

        permit_id = f"PERM-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now()

        permit = {
            "permit_id": permit_id,
            "company_name": company_name,
            "contractor_name": contractor_name,
            "vehicle_plate": vehicle_plate.upper(),
            "vehicle_height_meters": vehicle_height_meters,
            "purpose": purpose,
            "loading_bay_id": loading_bay_id,
            "issued_at": now.isoformat(),
            "valid_from": start_time or now.isoformat(),
            "valid_until": (now + timedelta(hours=duration_hours)).isoformat(),
            "status": "APPROVED",
            "security_clearance_badge": f"BADGE-{uuid.uuid4().hex[:8].upper()}"
        }

        _CONTRACTOR_PERMITS[permit_id] = permit
        return {"success": True, "permit": permit}

    @staticmethod
    def list_permits() -> List[Dict[str, Any]]:
        return list(_CONTRACTOR_PERMITS.values())
