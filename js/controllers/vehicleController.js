/**
 * SmartPark Client Vehicle Garage Controller
 * Manages user vehicle additions, default vehicle switching, and EV profile telemetry.
 */

import { appStore } from '../state/appState.js';
import { showToast } from '../components/toast.js';

export class VehicleController {
  static getVehicles() {
    return [
      { id: 'veh-01', plate: 'KA-01-MJ-5890', type: 'Car', model: 'Hyundai Ioniq 5', is_ev: true, is_default: true },
      { id: 'veh-02', plate: 'KA-05-AB-1234', type: 'Car', model: 'Honda City', is_ev: false, is_default: false },
      { id: 'veh-03', plate: 'KA-03-EM-8821', type: 'Two-Wheeler', model: 'Ather 450X', is_ev: true, is_default: false }
    ];
  }

  static addVehicle(plate, type, model, isEv) {
    showToast(`Vehicle ${plate.toUpperCase()} successfully added to your garage!`, 'success', 3500);
    return { success: true, plate };
  }
}
