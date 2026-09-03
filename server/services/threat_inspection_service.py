"""
SmartPark Under-Vehicle Threat Inspection (UVSS) Service
Coordinates in-ground color line-scan cameras capturing full 4K underbody images at entry gates.
"""

from typing import Dict, Any, List
from server.database.repositories.threat_inspection_repository import ThreatInspectionRepository, ThreatInspectionScan

class ThreatInspectionService:
    @staticmethod
    def get_inspection_scans() -> List[Dict[str, Any]]:
        scans = ThreatInspectionRepository.list_all()
        if not scans:
            sample = [
                ThreatInspectionScan(scan_code="UVSS-SCAN-9901", vehicle_plate="KA-01-MJ-5890")
            ]
            for s in sample:
                ThreatInspectionRepository.create(s)
            scans = ThreatInspectionRepository.list_all()

        return [s.to_dict() for s in scans]
