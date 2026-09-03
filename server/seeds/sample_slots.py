"""
SmartPark Bay Matrix & Parking Slots Seed Generator
Generates realistic multi-floor parking bay matrix records across Ground Floor, B1, and B2.
"""

from typing import List, Dict, Any

def generate_zone_bays(zone_id: str, zone_code: str, total_spaces: int = 60, ev_spaces: int = 8) -> List[Dict[str, Any]]:
    slots = []
    floors = ["G", "B1", "B2"]
    spaces_per_floor = total_spaces // len(floors)

    counter = 1
    ev_allocated = 0

    for floor in floors:
        for i in range(1, spaces_per_floor + 1):
            slot_num = f"{floor}-{i:02d}"
            is_ev = ev_allocated < ev_spaces
            if is_ev:
                ev_allocated += 1
                slot_type = "EV_FAST_CHARGE"
            elif i == 1:
                slot_type = "HANDICAPPED"
            elif i == 2:
                slot_type = "VIP"
            else:
                slot_type = "STANDARD"

            # Distribution: 65% available, 25% occupied, 10% reserved
            if counter % 4 == 0:
                status = "OCCUPIED"
            elif counter % 10 == 0:
                status = "RESERVED"
            else:
                status = "AVAILABLE"

            slots.append({
                "id": f"slot-{zone_id[:8]}-{floor.lower()}{i:02d}",
                "zone_id": zone_id,
                "slot_number": slot_num,
                "floor_level": floor,
                "slot_type": slot_type,
                "status": status,
                "sensor_id": f"sns-{zone_id[:6]}-{floor.lower()}{i:02d}"
            })
            counter += 1

    return slots
