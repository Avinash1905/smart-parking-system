"""
SmartPark P2P Shared Driveway & Subletting Marketplace Service
Coordinates homeowner space listings, driver booking requests, and host revenue payouts.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.p2p_sublet_repository import P2PSubletRepository, P2PListing

class P2PSubletService:
    @staticmethod
    def get_listings() -> List[Dict[str, Any]]:
        listings = P2PSubletRepository.list_all()
        if not listings:
            sample = [
                P2PListing(host_user_id="usr-host-01", host_name="Priya V.", title="Gated Driveway near Indiranagar Metro", address="12th Main, HAL 2nd Stage", hourly_rate=25.0, is_ev_charger_equipped=True),
                P2PListing(host_user_id="usr-host-02", host_name="Siddharth R.", title="Basement Covered Bay near Sony Signal", address="80 Feet Road, 4th Block Koramangala", hourly_rate=30.0, is_ev_charger_equipped=False)
            ]
            for s in sample:
                P2PSubletRepository.create(s)
            listings = P2PSubletRepository.list_all()

        return [l.to_dict() for l in listings]
