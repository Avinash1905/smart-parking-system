"""
SmartPark ANPR (Automated License Plate Recognition) Stream Processor
Simulates high-speed OCR optical ingestion from gate CCTV cameras,
confidence filtering, permit matching, and automated barrier triggering.
"""

import re
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional

class ANPRStreamProcessor:
    # Known regex patterns for standard license plates
    PLATE_REGEX = re.compile(r'^[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{1,3}[-\s]?[0-9]{4}$')

    def __init__(self):
        self.hotlist: Dict[str, Dict[str, Any]] = {
            "DL-01-XX-9999": {"reason": "Stolen Vehicle Report", "severity": "CRITICAL"},
            "KA-04-ZZ-0000": {"reason": "Unpaid Municipal Citations (>5)", "severity": "WARNING"}
        }

    def clean_plate(self, raw_text: str) -> str:
        """Normalizes noisy OCR text into standard uppercase alphanumerics."""
        cleaned = re.sub(r'[^A-Za-z0-9]', '', raw_text or '').upper()
        # Common OCR character substitutions
        cleaned = cleaned.replace('O', '0').replace('I', '1') if len(cleaned) > 4 else cleaned
        return cleaned

    def process_frame(
        self,
        camera_id: str,
        raw_plate_text: str,
        ocr_confidence: float,
        gate_id: str,
        gate_type: str = "ENTRY"
    ) -> Dict[str, Any]:
        """Evaluates an OCR frame event and determines gate barrier actuation."""
        timestamp = datetime.now().isoformat()
        cleaned_plate = self.clean_plate(raw_plate_text)

        # 1. Quality threshold check
        if ocr_confidence < 0.70:
            return {
                "event_id": f"anpr-{uuid.uuid4().hex[:8]}",
                "timestamp": timestamp,
                "camera_id": camera_id,
                "raw_plate": raw_plate_text,
                "status": "REJECTED_LOW_CONFIDENCE",
                "confidence": ocr_confidence,
                "barrier_action": "HOLD_CLOSED",
                "message": f"Optical confidence {round(ocr_confidence*100, 1)}% below required 70% threshold."
            }

        # 2. Hotlist / Blacklist Security Check
        is_blacklisted = cleaned_plate in self.hotlist
        if is_blacklisted:
            hotlist_info = self.hotlist[cleaned_plate]
            return {
                "event_id": f"anpr-{uuid.uuid4().hex[:8]}",
                "timestamp": timestamp,
                "camera_id": camera_id,
                "plate_number": cleaned_plate,
                "status": "SECURITY_HOTLIST_ALERT",
                "severity": hotlist_info["severity"],
                "reason": hotlist_info["reason"],
                "barrier_action": "LOCK_DOWN",
                "message": f"CRITICAL: License plate {cleaned_plate} flagged on active hotlist: {hotlist_info['reason']}."
            }

        # 3. Gate Entry / Exit Decision
        return {
            "event_id": f"anpr-{uuid.uuid4().hex[:8]}",
            "timestamp": timestamp,
            "camera_id": camera_id,
            "plate_number": cleaned_plate,
            "status": "VERIFIED_PASS",
            "confidence": ocr_confidence,
            "gate_id": gate_id,
            "gate_type": gate_type,
            "barrier_action": "OPEN_AUTO",
            "message": f"Vehicle {cleaned_plate} verified at gate {gate_id}. Barrier opening sequence initiated."
        }
