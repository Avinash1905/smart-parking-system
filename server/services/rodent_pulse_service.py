"""
SmartPark Ultrasonic Rodent & Pest Pulse Service
Modulates variable frequency acoustic pulses (20-65 kHz) preventing rodent habituation and protecting vehicle wiring.
"""

from typing import Dict, Any, List
from server.database.repositories.rodent_pulse_repository import RodentPulseRepository

class RodentPulseService:
    @staticmethod
    def get_rodent_repellent_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = RodentPulseRepository.get_latest(zone_id)
        return {
            "success": True,
            "rodent_pulse": node.to_dict(),
            "frequency_range": "20.0 kHz - 65.0 kHz Swept Sine",
            "safe_for_humans_and_pets": True
        }
