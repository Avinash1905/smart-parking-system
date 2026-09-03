"""
SmartPark EV Charging & Green Energy Service
Calculates charging speeds, energy consumption, carbon offset credits, and dynamic EV grid tariffs.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from server.database.repositories.ev_charging_repository import EVChargingRepository, EVChargingSession
from server.database.repositories.notification_repository import NotificationRepository
from server.models.schema import Notification

class EVChargingService:
    # 1 kWh EV charge saves approx 0.82 kg CO2 compared to standard combustion engine
    CO2_SAVINGS_RATIO_PER_KWH = 0.82

    @staticmethod
    def start_charge_session(data: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        zone_id = data.get("zone_id", "zone-pub-01")
        stall_id = data.get("stall_id", "EV-CCS2-01")
        connector_type = data.get("connector_type", "CCS2_FAST_CHARGE")
        power_kw = 60.0 if "CCS2" in connector_type else 22.0

        sess = EVChargingSession(
            user_id=user["id"],
            vehicle_plate=data.get("vehicle_plate", "KA-01-MJ-5890"),
            zone_id=zone_id,
            zone_name=data.get("zone_name", "Municipal Central Parking"),
            stall_id=stall_id,
            connector_type=connector_type,
            power_output_kw=power_kw,
            energy_delivered_kwh=0.0,
            rate_per_kwh=14.5,
            session_cost=0.0,
            co2_saved_kg=0.0,
            status="IN_PROGRESS"
        )
        EVChargingRepository.create(sess)

        NotificationRepository.create(Notification(
            user_id=user["id"],
            title="EV Fast Charging Started",
            message=f"Charging session initialized at {sess.zone_name} ({stall_id}, {power_kw}kW).",
            notification_type="SUCCESS",
            action_url="#/dashboard"
        ))

        return {"success": True, "session_id": sess.id, "data": sess.to_dict()}

    @staticmethod
    def stop_charge_session(session_id: str, energy_kwh: float = 18.4) -> Dict[str, Any]:
        cost = round(energy_kwh * 14.5, 2)
        co2_saved = round(energy_kwh * EVChargingService.CO2_SAVINGS_RATIO_PER_KWH, 2)

        return {
            "success": True,
            "session_id": session_id,
            "energy_delivered_kwh": energy_kwh,
            "session_cost_inr": cost,
            "co2_saved_kg": co2_saved,
            "status": "COMPLETED"
        }
