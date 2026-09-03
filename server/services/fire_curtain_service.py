"""
SmartPark Motorized Fire Curtain Automation Service
Controls automated ceiling-drop fire curtains to compartmentalize smoke and toxic fumes in underground basements.
"""

from typing import Dict, Any, List
from server.database.repositories.fire_curtain_repository import FireCurtainRepository, FireCurtainNode

class FireCurtainService:
    @staticmethod
    def get_curtains_status() -> List[Dict[str, Any]]:
        nodes = FireCurtainRepository.list_all()
        if not nodes:
            sample = [
                FireCurtainNode(curtain_code="FC-B1-NORTH-01", floor_level="Floor B1 (North Aisle)", motor_drive_status="STOWED_ARMED"),
                FireCurtainNode(curtain_code="FC-B2-SOUTH-02", floor_level="Floor B2 (South Ramp)", motor_drive_status="STOWED_ARMED")
            ]
            for s in sample:
                FireCurtainRepository.create(s)
            nodes = FireCurtainRepository.list_all()

        return [n.to_dict() for n in nodes]
