"""
SmartPark Gate SIP VoIP High-Definition Intercom Service
Routes crystal clear HD voice & video from entry barrier kiosks to the central security operations center.
"""

from typing import Dict, Any, List
from server.database.repositories.gate_intercom_repository import GateIntercomRepository

class GateIntercomService:
    @staticmethod
    def get_intercom_status(zone_id: str = "zone-pub-01") -> Dict[str, Any]:
        station = GateIntercomRepository.get_latest(zone_id)
        return {
            "success": True,
            "gate_intercom": station.to_dict(),
            "sip_server_domain": "sip.smartpark-enterprise.internal",
            "remote_barrier_open_capable": True
        }
