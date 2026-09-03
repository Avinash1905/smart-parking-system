"""
SmartPark Jet Fan VFD Inverter Matrix Service
Controls variable speed motor inverters to flush underground carbon monoxide and stale exhaust air efficiently.
"""

from typing import Dict, Any, List
from server.database.repositories.vfd_fan_matrix_repository import VFDFanMatrixRepository, VFDFanNode

class VFDFanMatrixService:
    @staticmethod
    def get_fan_matrix() -> List[Dict[str, Any]]:
        nodes = VFDFanMatrixRepository.list_all()
        if not nodes:
            sample = [
                VFDFanNode(fan_code="JET-FAN-B1-01", current_rpm=720, thrust_newtons=38.5, vfd_frequency_hz=30.0),
                VFDFanNode(fan_code="JET-FAN-B1-02", current_rpm=720, thrust_newtons=38.5, vfd_frequency_hz=30.0),
                VFDFanNode(fan_code="JET-FAN-B2-03", current_rpm=650, thrust_newtons=34.0, vfd_frequency_hz=28.0)
            ]
            for s in sample:
                VFDFanMatrixRepository.create(s)
            nodes = VFDFanMatrixRepository.list_all()

        return [n.to_dict() for n in nodes]
