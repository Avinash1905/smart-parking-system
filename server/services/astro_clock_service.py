"""
SmartPark Astronomical Solar Clock Lighting Service
Coordinates GPS-calculated sunset/sunrise dusk-to-dawn switching and circadian Kelvin transitions for human comfort.
"""

from typing import Dict, Any, List
from server.database.repositories.astro_clock_repository import AstroClockRepository

class AstroClockService:
    @staticmethod
    def get_astronomical_schedule(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        sched = AstroClockRepository.get_latest(zone_id)
        return {
            "success": True,
            "astro_schedule": sched.to_dict(),
            "auto_circadian_shift_enabled": True,
            "sunset_dusk_ramp_minutes": 15
        }
