"""
SmartPark Fire Safety & Deluge Sprinkler Monitoring Service
Monitors smoke loops, thermal temperature sensors, and dry-pipe sprinkler valves.
"""

from typing import Dict, Any, List
from server.database.repositories.fire_safety_repository import FireSafetyRepository, FireSafetyZone

class FireSafetyService:
    @staticmethod
    def get_fire_safety_status(zone_id: str = "zone-pub-01") -> List[Dict[str, Any]]:
        zones = FireSafetyRepository.list_by_zone(zone_id)
        if not zones:
            sample = [
                FireSafetyZone(zone_code="FIRE-B1-NORTH", parking_zone_id=zone_id, floor_level="B1", thermal_heat_sensor_celsius=24.8),
                FireSafetyZone(zone_code="FIRE-B2-SOUTH", parking_zone_id=zone_id, floor_level="B2", thermal_heat_sensor_celsius=25.2)
            ]
            for s in sample:
                FireSafetyRepository.create(s)
            zones = FireSafetyRepository.list_by_zone(zone_id)

        return [z.to_dict() for z in zones]
