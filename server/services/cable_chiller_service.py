"""
SmartPark EV Fast-Charger Cable Liquid Chiller Service
Regulates closed-loop glycol refrigeration maintaining charging cables at cool 18.5°C during 500-amp peak currents.
"""

from typing import Dict, Any, List
from server.database.repositories.cable_chiller_repository import CableChillerRepository

class CableChillerService:
    @staticmethod
    def get_chiller_telemetry(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        unit = CableChillerRepository.get_latest(zone_id)
        return {
            "success": True,
            "chiller": unit.to_dict(),
            "max_continuous_amperage": 500.0,
            "coolant_type": "PROPYLENE_GLYCOL_NON_TOXIC"
        }
