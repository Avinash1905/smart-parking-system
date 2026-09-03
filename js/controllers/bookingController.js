/**
 * SmartPark Client Reservation & Booking Wizard Controller
 * Coordinates multi-step stall selection, pricing preview, vehicle binding, and QR pass retrieval.
 */

import { appStore } from '../state/appState.js';
import { showToast } from '../components/toast.js';

export class BookingController {
  static async submitReservation(zoneId, slotNumber, durationHours, vehiclePlate, vehicleType) {
    const user = appStore.getState().currentUser;
    if (!user) {
      showToast('Please login to complete your parking reservation.', 'warning', 4000);
      return { success: false };
    }

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parking_zone_id: zoneId,
          slot_number: slotNumber,
          duration_hours: durationHours,
          vehicle_plate: vehiclePlate,
          vehicle_type: vehicleType,
          user_id: user.id
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Slot ${slotNumber} confirmed! Digital pass ready.`, 'success', 5000);
        return data;
      } else {
        showToast(data.message || 'Reservation could not be processed.', 'error', 4000);
        return data;
      }
    } catch (e) {
      showToast('Network error during reservation booking.', 'error', 4000);
      return { success: false, error: str(e) };
    }
  }
}
