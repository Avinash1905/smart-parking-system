"""
SmartPark Parking Session Lifecycle & State Machine Manager
Orchestrates state transitions: RESERVED -> ARRIVED -> ACTIVE -> EXTENDED -> OVERSTAY -> COMPLETED / CANCELLED.
Computes real-time duration billing, overstay penalties, grace period timers, and payment settlements.
"""

import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Tuple

class ParkingSessionState:
    PENDING_PAYMENT = "PENDING_PAYMENT"
    RESERVED = "RESERVED"
    ACTIVE = "ACTIVE"
    EXTENDED = "EXTENDED"
    OVERSTAY = "OVERSTAY"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    FORFEITED = "FORFEITED"

class SessionLifecycleManager:
    GRACE_PERIOD_MINUTES = 15
    OVERSTAY_PENALTY_MULTIPLIER = 1.5  # 1.5x regular hourly tariff for unreserved overstays

    @staticmethod
    def calculate_session_fee(
        start_time_iso: str,
        end_time_iso: str,
        hourly_rate: float,
        actual_exit_iso: Optional[str] = None
    ) -> Dict[str, Any]:
        """Calculates base tariff, overstay duration, penalty surcharges, and total payable amount."""
        start_dt = datetime.fromisoformat(start_time_iso.replace("Z", ""))
        scheduled_end_dt = datetime.fromisoformat(end_time_iso.replace("Z", ""))
        exit_dt = datetime.fromisoformat(actual_exit_iso.replace("Z", "")) if actual_exit_iso else datetime.utcnow()

        scheduled_hours = max(0.5, (scheduled_end_dt - start_dt).total_seconds() / 3600.0)
        base_amount = round(scheduled_hours * hourly_rate, 2)

        # Overstay calculation
        overstay_minutes = 0
        overstay_charge = 0.0
        is_overstay = False

        if exit_dt > scheduled_end_dt:
            excess_seconds = (exit_dt - scheduled_end_dt).total_seconds()
            excess_minutes = int(excess_seconds / 60.0)
            
            if excess_minutes > SessionLifecycleManager.GRACE_PERIOD_MINUTES:
                is_overstay = True
                overstay_minutes = excess_minutes
                chargeable_hours = math.ceil(overstay_minutes / 60.0)
                overstay_charge = round(chargeable_hours * hourly_rate * SessionLifecycleManager.OVERSTAY_PENALTY_MULTIPLIER, 2)

        total_due = round(base_amount + overstay_charge, 2)

        return {
            "scheduled_hours": round(scheduled_hours, 1),
            "base_rate_per_hour": hourly_rate,
            "base_amount": base_amount,
            "is_overstay": is_overstay,
            "overstay_minutes": overstay_minutes,
            "overstay_penalty_multiplier": SessionLifecycleManager.OVERSTAY_PENALTY_MULTIPLIER if is_overstay else 1.0,
            "overstay_charge": overstay_charge,
            "total_amount": total_due,
            "grace_period_applied_minutes": SessionLifecycleManager.GRACE_PERIOD_MINUTES
        }

    @staticmethod
    def can_transition(current_state: str, new_state: str) -> Tuple[bool, str]:
        """Enforces valid state transition matrix for parking sessions."""
        valid_transitions = {
            ParkingSessionState.PENDING_PAYMENT: [ParkingSessionState.RESERVED, ParkingSessionState.CANCELLED],
            ParkingSessionState.RESERVED: [ParkingSessionState.ACTIVE, ParkingSessionState.CANCELLED, ParkingSessionState.FORFEITED],
            ParkingSessionState.ACTIVE: [ParkingSessionState.EXTENDED, ParkingSessionState.OVERSTAY, ParkingSessionState.COMPLETED],
            ParkingSessionState.EXTENDED: [ParkingSessionState.OVERSTAY, ParkingSessionState.COMPLETED],
            ParkingSessionState.OVERSTAY: [ParkingSessionState.COMPLETED],
            ParkingSessionState.COMPLETED: [],
            ParkingSessionState.CANCELLED: [],
            ParkingSessionState.FORFEITED: []
        }

        allowed = valid_transitions.get(current_state, [])
        if new_state in allowed:
            return True, "Transition authorized."
        return False, f"Invalid transition from state '{current_state}' to '{new_state}'."

    @staticmethod
    def generate_digital_receipt(session: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        """Generates itemized GST-compliant digital invoice payload."""
        receipt_id = f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        base_fee = float(session.get("total_amount", 40.0))
        cgst_9pct = round(base_fee * 0.09, 2)
        sgst_9pct = round(base_fee * 0.09, 2)
        grand_total = round(base_fee + cgst_9pct + sgst_9pct, 2)

        return {
            "invoice_number": receipt_id,
            "invoice_date": datetime.utcnow().strftime("%d %b %Y, %I:%M %p UTC"),
            "customer_name": user.get("name", "Registered Driver"),
            "customer_email": user.get("email", ""),
            "vehicle_plate": session.get("vehicle_plate", "KA-01-AB-1234"),
            "zone_name": session.get("parking_zone_name", "Municipal Parking Hub"),
            "slot_number": session.get("slot_number", "A-01"),
            "duration_hours": session.get("duration_hours", 2.0),
            "tariff_rate_hourly": session.get("hourly_rate", 20.0),
            "line_items": [
                {"description": f"Parking Slot Reservation ({session.get('duration_hours', 2)} hrs)", "amount": base_fee},
                {"description": "Central GST (CGST 9.0%)", "amount": cgst_9pct},
                {"description": "State GST (SGST 9.0%)", "amount": sgst_9pct}
            ],
            "subtotal": base_fee,
            "tax_total": round(cgst_9pct + sgst_9pct, 2),
            "grand_total": grand_total,
            "payment_status": "PAID_DIGITALLY",
            "payment_gateway": "UPI / SmartPark FastPass Wallet",
            "hsn_sac_code": "998599 - Other support services n.e.c."
        }
