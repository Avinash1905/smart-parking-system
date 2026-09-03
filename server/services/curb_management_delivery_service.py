"""
SmartPark Dynamic Municipal Curb Space & Micro-Freight Delivery Service
Allocates street curb zones flexibly between morning delivery unloads,
afternoon short-stay customer parking, and evening ride-hail pickup/dropoff zones.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime, timedelta

_CURB_ZONES = [
    {"curb_id": "CURB-MG-01", "name": "MG Road Promenade Zone A", "total_bays": 6, "current_policy": "COMMERCIAL_LOADING_ONLY", "max_stay_mins": 30, "price_per_hr": 30.0},
    {"curb_id": "CURB-BR-02", "name": "Brigade Road Commercial Hub", "total_bays": 8, "current_policy": "FLEX_DELIVERY_DROP", "max_stay_mins": 15, "price_per_hr": 20.0},
    {"curb_id": "CURB-IN-03", "name": "Indiranagar 100ft Road West", "total_bays": 10, "current_policy": "EV_RIDESHARE_STAGING", "max_stay_mins": 45, "price_per_hr": 25.0}
]

class CurbManagementDeliveryService:
    @staticmethod
    def reserve_curb_slot(
        curb_id: str,
        company_name: str,
        vehicle_plate: str,
        purpose: str = "E_COMMERCE_PARCEL_DROP",
        duration_minutes: int = 20
    ) -> Dict[str, Any]:
        permit_token = f"CURB-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now()

        permit = {
            "permit_token": permit_token,
            "curb_id": curb_id,
            "company_name": company_name,
            "vehicle_plate": vehicle_plate.upper(),
            "purpose": purpose,
            "issued_at": now.isoformat(),
            "valid_until": (now + timedelta(minutes=duration_minutes)).isoformat(),
            "duration_minutes": duration_minutes,
            "status": "AUTHORIZED_ACTIVE",
            "overstay_penalty_per_min": 10.0
        }
        return {"success": True, "permit": permit}

    @staticmethod
    def list_curb_zones() -> List[Dict[str, Any]]:
        return _CURB_ZONES
