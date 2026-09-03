"""
SmartPark Acoustic Sound Barrier Wall Service
Monitors STC 45 sound absorption panels ensuring facility garage noise does not exceed 50 dBA at property borders.
"""

from typing import Dict, Any, List
from server.database.repositories.sound_barrier_repository import SoundBarrierRepository

class SoundBarrierService:
    @staticmethod
    def get_barrier_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        node = SoundBarrierRepository.get_latest(zone_id)
        return {
            "success": True,
            "sound_barrier": node.to_dict(),
            "max_residential_limit_dba": 50.0,
            "barrier_material": "PERFORATED_ALUMINUM_MINERAL_WOOL"
        }
