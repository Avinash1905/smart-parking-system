"""
SmartPark Maintenance Operations & Technician Dispatch Service
Handles asset maintenance scheduling, work orders, and technician dispatches.
"""

from typing import Dict, Any, List
from server.database.repositories.maintenance_repository import MaintenanceRepository, MaintenanceWorkOrder

class MaintenanceService:
    @staticmethod
    def get_work_orders() -> List[Dict[str, Any]]:
        orders = MaintenanceRepository.list_all()
        if not orders:
            sample = [
                MaintenanceWorkOrder(work_order_code="WO-8821", zone_name="Municipal Central Parking", asset_type="BOOM_BARRIER_MOTOR", priority="HIGH", description="North Gate entry barrier motor calibration.", assigned_technician="Ravi Teja", status="IN_PROGRESS"),
                MaintenanceWorkOrder(work_order_code="WO-8822", zone_name="TCS Corporate Deck Alpha", asset_type="EV_CHARGER_CABLE", priority="MEDIUM", description="CCS2 60kW charging cable insulation check.", assigned_technician="Siddharth K.", status="OPEN")
            ]
            for s in sample:
                MaintenanceRepository.create(s)
            orders = MaintenanceRepository.list_all()

        return [o.to_dict() for o in orders]
