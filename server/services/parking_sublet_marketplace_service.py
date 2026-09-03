"""
SmartPark Peer-to-Peer (P2P) Corporate Parking Sublet Marketplace Service
Allows employees with designated monthly parking bays to list their unused spots on days
they work from home (WFH), splitting revenue with the facility operator.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime, timedelta

_SUBLET_LISTINGS: Dict[str, Dict[str, Any]] = {
    "SUB-201": {
        "listing_id": "SUB-201",
        "host_employee_id": "EMP-4102",
        "host_name": "Pooja Hegde",
        "company_id": "comp_tcs_hq",
        "zone_id": "zone-pvt-01",
        "slot_number": "M-14",
        "available_date": "2026-09-04",
        "daily_price_inr": 80.0,
        "status": "AVAILABLE_FOR_BOOKING",
        "revenue_split": {"host_share_pct": 70.0, "facility_platform_share_pct": 30.0}
    }
}

class ParkingSubletMarketplaceService:
    @staticmethod
    def list_sublet_spot(
        host_employee_id: str,
        host_name: str,
        company_id: str,
        zone_id: str,
        slot_number: str,
        available_date: str,
        daily_price_inr: float = 80.0
    ) -> Dict[str, Any]:
        listing_id = f"SUB-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now()

        listing = {
            "listing_id": listing_id,
            "host_employee_id": host_employee_id,
            "host_name": host_name,
            "company_id": company_id,
            "zone_id": zone_id,
            "slot_number": slot_number,
            "available_date": available_date,
            "daily_price_inr": daily_price_inr,
            "created_at": now.isoformat(),
            "status": "AVAILABLE_FOR_BOOKING",
            "revenue_split": {"host_share_pct": 70.0, "facility_platform_share_pct": 30.0}
        }

        _SUBLET_LISTINGS[listing_id] = listing
        return {"success": True, "listing": listing}

    @staticmethod
    def book_sublet(listing_id: str, renter_employee_id: str, renter_name: str, renter_plate: str) -> Dict[str, Any]:
        if listing_id not in _SUBLET_LISTINGS:
            return {"success": False, "message": "Sublet listing not found"}

        listing = _SUBLET_LISTINGS[listing_id]
        if listing["status"] != "AVAILABLE_FOR_BOOKING":
            return {"success": False, "message": "Spot has already been booked for this date"}

        listing["status"] = "BOOKED"
        listing["renter_employee_id"] = renter_employee_id
        listing["renter_name"] = renter_name
        listing["renter_plate"] = renter_plate.upper()
        listing["booked_at"] = datetime.now().isoformat()
        listing["access_qr_code"] = f"SUB-QR-{uuid.uuid4().hex[:8].upper()}"

        return {"success": True, "message": "Sublet booking confirmed", "booking": listing}

    @staticmethod
    def get_available_sublets(company_id: str) -> List[Dict[str, Any]]:
        return [l for l in _SUBLET_LISTINGS.values() if l["company_id"] == company_id and l["status"] == "AVAILABLE_FOR_BOOKING"]
