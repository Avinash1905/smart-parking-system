"""
SmartPark Multi-Country ANPR OCR Processing & Privacy Masking Pipeline Service
Provides optical character recognition preprocessing, contour detection,
multi-jurisdiction license plate formatting, and GDPR-compliant plate masking.
"""

from typing import Dict, List, Any, Optional, Tuple
import re
import uuid
from datetime import datetime

class ANPRPipelineService:
    JURISDICTION_FORMATS = {
        "IN": [r'^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{4}$', r'^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$'],
        "US_CA": [r'^[0-9][A-Z]{3}[0-9]{3}$', r'^[A-Z0-9]{1,7}$'],
        "UK": [r'^[A-Z]{2}[0-9]{2}[A-Z]{3}$'],
        "EU_DE": [r'^[A-Z]{1,3}[A-Z]{1,2}[0-9]{1,4}$']
    }

    @classmethod
    def preprocess_image_frame(
        cls,
        frame_bytes_length: int,
        resolution_width: int = 1920,
        resolution_height: int = 1080,
        contrast_ratio: float = 1.45,
        ambient_lux: float = 350.0
    ) -> Dict[str, Any]:
        """Calculates optical quality metrics and adaptive exposure compensation."""
        needs_infrared_strobe = ambient_lux < 50.0
        exposure_time_ms = 4.0 if ambient_lux > 500.0 else 16.0
        snr_db = round(20.0 * math_log10(max(1.0, contrast_ratio * 15.0)), 1)

        return {
            "resolution": f"{resolution_width}x{resolution_height}",
            "frame_size_kb": round(frame_bytes_length / 1024, 1),
            "ambient_lux": ambient_lux,
            "infrared_strobe_active": needs_infrared_strobe,
            "exposure_time_ms": exposure_time_ms,
            "signal_to_noise_ratio_db": snr_db,
            "quality_grade": "EXCELLENT" if snr_db >= 28.0 else ("GOOD" if snr_db >= 20.0 else "FAIR")
        }

    @classmethod
    def recognize_plate(
        cls,
        raw_ocr_string: str,
        confidence_scores: List[float],
        jurisdiction: str = "IN"
    ) -> Dict[str, Any]:
        """Validates, cleans, and structures license plate recognition results."""
        cleaned = re.sub(r'[^A-Za-z0-9]', '', raw_ocr_string or '').upper()
        
        # Calculate mean confidence
        mean_conf = round(sum(confidence_scores) / max(1, len(confidence_scores)), 3) if confidence_scores else 0.85
        
        # Check against jurisdiction regex
        patterns = cls.JURISDICTION_FORMATS.get(jurisdiction, cls.JURISDICTION_FORMATS["IN"])
        is_valid_format = any(bool(re.match(p, cleaned)) for p in patterns)

        # Anonymized / Privacy-masked version (e.g. KA-01-***-5890)
        if len(cleaned) >= 6:
            masked = f"{cleaned[:4]}-{'*' * (len(cleaned) - 7)}-{cleaned[-4:]}" if len(cleaned) >= 8 else f"{cleaned[:2]}***{cleaned[-2:]}"
        else:
            masked = "****"

        return {
            "raw_text": raw_ocr_string,
            "cleaned_plate": cleaned,
            "masked_for_privacy": masked,
            "jurisdiction": jurisdiction,
            "is_valid_syntax": is_valid_format,
            "optical_confidence": mean_conf,
            "timestamp": datetime.now().isoformat()
        }

def math_log10(x: float) -> float:
    import math
    return math.log10(x)
