"""
SmartPark Air Bio-Scrubber & Particulate Filtration Service
Coordinates electrostatic dust collection and HEPA particulate scrubbers in enclosed parking structures.
"""

from typing import Dict, Any, List
from server.database.repositories.air_scrubber_repository import AirScrubberRepository, AirScrubberUnit

class AirScrubberService:
    @staticmethod
    def get_scrubbers_status() -> List[Dict[str, Any]]:
        scrubbers = AirScrubberRepository.list_all()
        if not scrubbers:
            sample = [
                AirScrubberUnit(unit_code="SCRUB-B1-01", floor_level="Floor B1 (Center Bay)", particulate_filtration_efficiency_pct=88.0),
                AirScrubberUnit(unit_code="SCRUB-B2-02", floor_level="Floor B2 (Ramp Exhaust)", particulate_filtration_efficiency_pct=92.4)
            ]
            for s in sample:
                AirScrubberRepository.create(s)
            scrubbers = AirScrubberRepository.list_all()

        return [s.to_dict() for s in scrubbers]
