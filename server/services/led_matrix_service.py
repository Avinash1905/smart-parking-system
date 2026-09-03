"""
SmartPark Overhead Ultrasonic RGB LED Matrix Controller Service
Coordinates real-time overhead LED color states (Green, Red, Cyan EV, Amber Reserved).
"""

from typing import Dict, Any, List
from server.database.repositories.led_matrix_repository import LEDMatrixRepository, LEDMatrixStrip

class LEDMatrixService:
    @staticmethod
    def get_led_matrix(zone_id: str = "zone-pub-01") -> List[Dict[str, Any]]:
        strips = LEDMatrixRepository.list_by_zone(zone_id)
        if not strips:
            sample = [
                LEDMatrixStrip(slot_code="A-01", zone_id=zone_id, led_color_state="GREEN"),
                LEDMatrixStrip(slot_code="A-02", zone_id=zone_id, led_color_state="RED"),
                LEDMatrixStrip(slot_code="A-03", zone_id=zone_id, led_color_state="CYAN_EV"),
                LEDMatrixStrip(slot_code="A-04", zone_id=zone_id, led_color_state="GREEN"),
                LEDMatrixStrip(slot_code="A-05", zone_id=zone_id, led_color_state="AMBER_RESERVED")
            ]
            for s in sample:
                LEDMatrixRepository.create(s)
            strips = LEDMatrixRepository.list_by_zone(zone_id)

        return [s.to_dict() for s in strips]
