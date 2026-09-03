"""
SmartPark Autonomous Vehicle (AV) Staging & Wireless Inductive Charging Service
Coordinates self-driving robotaxi fleet holding bays and inductive wireless charging telemetry.
"""

from typing import Dict, Any, List
from server.database.repositories.av_staging_repository import AVStagingRepository, AVStagingBay

class AVStagingService:
    @staticmethod
    def get_staging_status() -> List[Dict[str, Any]]:
        bays = AVStagingRepository.list_all()
        if not bays:
            sample = [
                AVStagingBay(bay_code="AV-BAY-01", fleet_provider="Waymo Driver", vehicle_av_id="AV-POD-801", staging_status="INDUCTIVE_CHARGING_ACTIVE"),
                AVStagingBay(bay_code="AV-BAY-02", fleet_provider="Cruise Origin", vehicle_av_id="AV-POD-802", staging_status="STAGED_READY_FOR_DISPATCH"),
                AVStagingBay(bay_code="AV-BAY-03", fleet_provider="Zoox Autonomous", vehicle_av_id="AV-POD-803", staging_status="STAGED_READY_FOR_DISPATCH")
            ]
            for s in sample:
                AVStagingRepository.create(s)
            bays = AVStagingRepository.list_all()

        return [b.to_dict() for b in bays]
