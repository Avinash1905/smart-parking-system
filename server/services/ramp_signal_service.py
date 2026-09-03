"""
SmartPark Helical Ramp Traffic Signal Sequencing Service
Coordinates alternating one-way traffic light sequences on single-lane helical underground ramps.
"""

from typing import Dict, Any, List
from server.database.repositories.ramp_signal_repository import RampSignalRepository, RampSignalPhase

class RampSignalService:
    @staticmethod
    def get_ramp_status() -> List[Dict[str, Any]]:
        ramps = RampSignalRepository.list_all()
        if not ramps:
            sample = [
                RampSignalPhase(ramp_code="RAMP-G-TO-B1", current_signal_phase="DOWNWARD_GREEN", cycle_remaining_seconds=18),
                RampSignalPhase(ramp_code="RAMP-B1-TO-B2", current_signal_phase="UPWARD_GREEN", cycle_remaining_seconds=12)
            ]
            for s in sample:
                RampSignalRepository.create(s)
            ramps = RampSignalRepository.list_all()

        return [r.to_dict() for r in ramps]
