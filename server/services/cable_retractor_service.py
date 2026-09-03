"""
SmartPark Overhead EV Cable Retractor Service
Coordinates automated motorized ceiling drop-downs of heavy CCS2 charging cables when an EV enters a bay.
"""

from typing import Dict, Any, List
from server.database.repositories.cable_retractor_repository import CableRetractorRepository, CableRetractorNode

class CableRetractorService:
    @staticmethod
    def get_retractors_status() -> List[Dict[str, Any]]:
        nodes = CableRetractorRepository.list_all()
        if not nodes:
            sample = [
                CableRetractorNode(reel_code="REEL-EV-A03", slot_code="A-03", motor_drive_state="STOWED_CEILING"),
                CableRetractorNode(reel_code="REEL-EV-A04", slot_code="A-04", motor_drive_state="STOWED_CEILING")
            ]
            for s in sample:
                CableRetractorRepository.create(s)
            nodes = CableRetractorRepository.list_all()

        return [n.to_dict() for n in nodes]
