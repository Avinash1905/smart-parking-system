"""
SmartPark Corporate Visitor Pre-Clearance & Host Employee Approval Service
Coordinates digital guest invitations, NDA sign-offs, and security gate passes for corporate campuses.
"""

from typing import Dict, Any, List
from server.database.repositories.visitor_preclearance_repository import VisitorPreclearanceRepository, VisitorPreclearance

class VisitorPreclearanceService:
    @staticmethod
    def get_visitor_passes() -> List[Dict[str, Any]]:
        passes = VisitorPreclearanceRepository.list_all()
        if not passes:
            sample = [
                VisitorPreclearance(pass_code="VIS-TCS-9021", visitor_name="Rajesh Gupta", visitor_email="rajesh.g@client.com", visitor_vehicle_plate="KA-03-HA-8822", visit_scheduled_time="Tomorrow, 10:00 AM")
            ]
            for s in sample:
                VisitorPreclearanceRepository.create(s)
            passes = VisitorPreclearanceRepository.list_all()

        return [p.to_dict() for p in passes]
