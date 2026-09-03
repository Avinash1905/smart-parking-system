"""
SmartPark Underground Dehumidification & Condensation Control Service
Regulates basement relative humidity below 55% to prevent slippery floor condensation and corrosion.
"""

from typing import Dict, Any, List
from server.database.repositories.dehumidifier_repository import DehumidifierRepository, DehumidifierUnit

class DehumidifierService:
    @staticmethod
    def get_dehumidifiers_status() -> List[Dict[str, Any]]:
        units = DehumidifierRepository.list_all()
        if not units:
            sample = [
                DehumidifierUnit(unit_code="DHUM-B2-01", floor_level="Floor B2 (Deep Sump Aisle)", relative_humidity_pct=52.4),
                DehumidifierUnit(unit_code="DHUM-B3-02", floor_level="Floor B3 (Lowest Vault)", relative_humidity_pct=53.1)
            ]
            for s in sample:
                DehumidifierRepository.create(s)
            units = DehumidifierRepository.list_all()

        return [u.to_dict() for u in units]
