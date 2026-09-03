"""
SmartPark Inductive Wireless EV Charging Service
Coordinates 150kW hands-free magnetic resonant wireless power transfer for electric buses and premium EVs.
"""

from typing import Dict, Any, List
from server.database.repositories.inductive_charging_repository import InductiveChargingRepository, InductiveChargingPad

class InductiveChargingService:
    @staticmethod
    def get_wireless_pads(zone_id: str = "zone-pub-01") -> List[Dict[str, Any]]:
        pads = InductiveChargingRepository.list_by_zone(zone_id)
        if not pads:
            sample = [
                InductiveChargingPad(pad_code="WIRELESS-PAD-B1-01", slot_code="W-01", current_transfer_power_kw=142.5),
                InductiveChargingPad(pad_code="WIRELESS-PAD-B1-02", slot_code="W-02", current_transfer_power_kw=145.0)
            ]
            for s in sample:
                InductiveChargingRepository.create(s)
            pads = InductiveChargingRepository.list_by_zone(zone_id)

        return [p.to_dict() for p in pads]
