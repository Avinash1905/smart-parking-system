"""
SmartPark Dynamic Variable Message Signage (VMS) Display Protocol Service
Generates NTCIP-compliant display bitmasks, RGB full-matrix text headers,
and dynamic arrow/cross guidance graphics for external roadway signage.
"""

from typing import Dict, List, Any
from datetime import datetime

class DynamicVMSMatrixService:
    SIGNS = {
        "VMS-ROAD-NORTH": {"sign_id": "VMS-ROAD-NORTH", "location": "North Outer Ring Road Approach", "resolution": "128x64"},
        "VMS-ROAD-SOUTH": {"sign_id": "VMS-ROAD-SOUTH", "location": "South Metro Flyover Exit", "resolution": "128x64"},
        "VMS-DECK-G": {"sign_id": "VMS-DECK-G", "location": "Ground Floor Main Aisle Split", "resolution": "96x32"}
    }

    @classmethod
    def generate_vms_payload(cls, sign_id: str, zone_name: str, available_slots: int, total_slots: int) -> Dict[str, Any]:
        occ_ratio = (total_slots - available_slots) / max(1, total_slots)
        
        if available_slots <= 0:
            line_1 = f"{zone_name[:16].upper()}"
            line_2 = "LOT FULL / USE SOUTH"
            color_hex = "#EF4444"  # Red
            guidance_icon = "CROSS_RED"
        elif occ_ratio >= 0.85:
            line_1 = f"{zone_name[:16].upper()}"
            line_2 = f"SPACES: {available_slots:02d} (NEAR FULL)"
            color_hex = "#F59E0B"  # Amber
            guidance_icon = "ARROW_AMBER"
        else:
            line_1 = f"{zone_name[:16].upper()}"
            line_2 = f"SPACES OPEN: {available_slots:02d}"
            color_hex = "#10B981"  # Green
            guidance_icon = "ARROW_GREEN"

        return {
            "sign_id": sign_id,
            "timestamp": datetime.now().isoformat(),
            "line_1_text": line_1,
            "line_2_text": line_2,
            "primary_color": color_hex,
            "guidance_graphic": guidance_icon,
            "ntcip_frame_code": f"[jl3][g1][cr{color_hex[1:]}]{line_1}[nl][cr{color_hex[1:]}]{line_2}",
            "brightness_pct": 85
        }
