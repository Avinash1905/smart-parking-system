"""
SmartPark Predictive Facility Maintenance & Work Order Service
Automatically opens technician work orders when ultrasonic spot sensors fail heartbeat checks,
gate barriers encounter torque overloads, or LED spotlight lumens drop.
"""

from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime

_WORK_ORDERS: Dict[str, Dict[str, Any]] = {
    "WO-101": {
        "work_order_id": "WO-101",
        "equipment_id": "SNS-PUB01-S04",
        "equipment_type": "ULTRASONIC_SPOT_SENSOR",
        "zone_id": "zone-pub-01",
        "fault_description": "Sensor missed 5 consecutive heartbeats; suspected battery depletion.",
        "priority": "MEDIUM",
        "assigned_technician": "Rajesh Kumar (Field Tech #03)",
        "status": "IN_PROGRESS",
        "created_at": "2026-09-03T08:30:00"
    }
}

class MaintenanceWorkorderService:
    @staticmethod
    def create_work_order(
        equipment_id: str,
        equipment_type: str,
        zone_id: str,
        fault_description: str,
        priority: str = "MEDIUM"
    ) -> Dict[str, Any]:
        wo_id = f"WO-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.now()

        order = {
            "work_order_id": wo_id,
            "equipment_id": equipment_id,
            "equipment_type": equipment_type.upper(),
            "zone_id": zone_id,
            "fault_description": fault_description,
            "priority": priority.upper(),
            "assigned_technician": "Auto-Dispatched Field Crew",
            "status": "OPEN",
            "created_at": now.isoformat()
        }
        _WORK_ORDERS[wo_id] = order
        return {"success": True, "work_order": order}

    @staticmethod
    def close_work_order(work_order_id: str, resolution_notes: str) -> Dict[str, Any]:
        if work_order_id not in _WORK_ORDERS:
            return {"success": False, "message": "Work order not found"}

        wo = _WORK_ORDERS[work_order_id]
        wo["status"] = "COMPLETED"
        wo["closed_at"] = datetime.now().isoformat()
        wo["resolution_notes"] = resolution_notes
        return {"success": True, "work_order": wo}

    @staticmethod
    def list_work_orders(status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        if status_filter:
            return [w for w in _WORK_ORDERS.values() if w["status"] == status_filter.upper()]
        return list(_WORK_ORDERS.values())
