"""
SmartPark Computer Vision ANPR Stream Processor Service
Performs simulated license plate OCR character detection, whitelist cross-checks, and automated gate triggers.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from server.database.repositories.anpr_repository import ANPRRepository, ANPRCaptureEvent
from server.database.repositories.parking_slot_repository import ParkingSlotRepository
from server.database.repositories.reservation_repository import ReservationRepository
from server.database.repositories.parking_zone_repository import ParkingZoneRepository

class ANPRProcessorService:
    @staticmethod
    def process_camera_frame(camera_id: str, plate_text: str, location: str = "North Entry Gate") -> Dict[str, Any]:
        plate_clean = plate_text.upper().strip()

        # Check if plate has active reservation
        res = ReservationRepository.list_all(status="RESERVED")
        matched_res = next((r for r in res if r.vehicle_plate.replace("-", "").replace(" ", "") == plate_clean.replace("-", "").replace(" ", "")), None)

        if matched_res:
            barrier_action = "GATE_LIFTED_AUTO"
            matched_user = matched_res.user_id
            matched_id = matched_res.id
        else:
            barrier_action = "ACCESS_DENIED" if "PVT" in camera_id else "GATE_LIFTED_AUTO"
            matched_user = None
            matched_id = None

        event = ANPRCaptureEvent(
            camera_id=camera_id,
            camera_location=location,
            detected_plate=plate_clean,
            confidence_score=0.985,
            matched_user_id=matched_user,
            matched_reservation_id=matched_id,
            barrier_action=barrier_action,
            processing_time_ms=38
        )
        ANPRRepository.create(event)

        return {"success": True, "event_id": event.id, "data": event.to_dict()}
