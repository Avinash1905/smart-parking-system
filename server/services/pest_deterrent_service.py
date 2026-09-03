"""
SmartPark Ultrasonic Pest Deterrent Service
Emits non-lethal, swept high-frequency ultrasound waves (inaudible to humans) to safeguard car engine bays.
"""

from typing import Dict, Any, List
from server.database.repositories.pest_deterrent_repository import PestDeterrentRepository, PestDeterrentTransducer

class PestDeterrentService:
    @staticmethod
    def get_transducers_status() -> List[Dict[str, Any]]:
        nodes = PestDeterrentRepository.list_all()
        if not nodes:
            sample = [
                PestDeterrentTransducer(transducer_code="PEST-US-B1-01", floor_level="Floor B1 (Cable Trays)"),
                PestDeterrentTransducer(transducer_code="PEST-US-B2-02", floor_level="Floor B2 (Power Distribution)")
            ]
            for s in sample:
                PestDeterrentRepository.create(s)
            nodes = PestDeterrentRepository.list_all()

        return [n.to_dict() for n in nodes]
