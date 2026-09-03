"""
SmartPark VoIP Digital Intercom & Help Point Service
Coordinates live two-way SIP audio sessions between drivers at barriers and central facility security.
"""

from typing import Dict, Any, List
from server.database.repositories.voip_intercom_repository import IntercomRepository, IntercomCallbox

class VoIPIntercomService:
    @staticmethod
    def get_intercom_stations() -> List[Dict[str, Any]]:
        boxes = IntercomRepository.list_all()
        if not boxes:
            sample = [
                IntercomCallbox(callbox_code="ICOM-NORTH-GATE-01", location_label="North Entry Barrier #1", sip_extension="1041"),
                IntercomCallbox(callbox_code="ICOM-ELEV-LOBBY-B1", location_label="Basement B1 Elevator Lobby", sip_extension="1042"),
                IntercomCallbox(callbox_code="ICOM-PVT-TCS-01", location_label="TCS Think Campus Gate 1", sip_extension="1043")
            ]
            for s in sample:
                IntercomRepository.create(s)
            boxes = IntercomRepository.list_all()

        return [b.to_dict() for b in boxes]
