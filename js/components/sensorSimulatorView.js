/**
 * Admin IoT Sensor Simulator Console
 * Enables real-time simulation of IoT road studs, boom barriers, and ANPR cameras with live telemetry log streaming.
 */

import { apiClient } from '../services/apiClient.js';
import { showToast } from './toast.js';

export function renderSensorSimulator(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="simulator-console-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(16, 185, 129, 0.15); color: var(--status-high-text); margin-bottom: 6px;">
            📡 Hardware Emulation Interface
          </span>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">IoT Sensor & Telemetry Simulator</h2>
          <p style="font-size: 0.875rem; color: var(--text-secondary);">Simulate ANPR boom barriers and ultrasonic ground studs to test live platform occupancy changes.</p>
        </div>

        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-telemetry-log">Clear Telemetry Log</button>
        </div>
      </div>

      <!-- Target Facility & Bay Selection -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 24px;">
        <div class="input-group">
          <label class="input-label" for="sim-zone-select">Target Parking Facility</label>
          <select id="sim-zone-select" class="input-control">
            <option value="zone-pub-01">Municipal Central Parking</option>
            <option value="zone-pub-02">City Center Metro Plaza</option>
            <option value="zone-pvt-01">TCS Corporate Parking Alpha</option>
            <option value="zone-pvt-02">Infosys Multi-Tier Employee Deck</option>
          </select>
        </div>

        <div class="input-group">
          <label class="input-label" for="sim-slot-input">Target Slot / Bay ID</label>
          <input type="text" id="sim-slot-input" class="input-control" value="A-14" />
        </div>

        <div class="input-group">
          <label class="input-label" for="sim-plate-input">Simulated Vehicle Plate</label>
          <input type="text" id="sim-plate-input" class="input-control" value="KA-05-MH-8819" style="text-transform: uppercase;" />
        </div>
      </div>

      <!-- Interactive Event Triggers Grid -->
      <div class="simulator-controls-grid">
        <div class="simulator-btn-card" id="sim-btn-entry">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--status-high-text);">
            <span>🚗</span> Vehicle Ingress (Entry Barrier)
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            Fires ANPR camera detection event & decrements available spaces in the backend.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" style="margin-top: auto; border-color: #10b981; color: #10b981;">
            Trigger Vehicle Entry
          </button>
        </div>

        <div class="simulator-btn-card" id="sim-btn-exit">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: #3b82f6;">
            <span>🚙</span> Vehicle Egress (Exit Barrier)
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            Fires exit gate sensor event & increments available spaces in the database.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" style="margin-top: auto; border-color: #3b82f6; color: #3b82f6;">
            Trigger Vehicle Exit
          </button>
        </div>

        <div class="simulator-btn-card" id="sim-btn-slot-occ">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: #ef4444;">
            <span>🅿️</span> Ground Stud: Bay Occupied
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            Ultrasonic floor sensor reports magnetic inductance change (Slot Occupied).
          </p>
          <button type="button" class="btn btn-secondary btn-sm" style="margin-top: auto; border-color: #ef4444; color: #ef4444;">
            Occupy Target Slot
          </button>
        </div>

        <div class="simulator-btn-card" id="sim-btn-slot-vac">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: #f59e0b;">
            <span>🟢</span> Ground Stud: Bay Vacated
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">
            Ultrasonic sensor reports bay clearance and transmits availability heartbeat.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" style="margin-top: auto; border-color: #f59e0b; color: #f59e0b;">
            Vacate Target Slot
          </button>
        </div>
      </div>

      <!-- Live Stream Telemetry Console -->
      <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Live Telemetry Stream (JSON Packets)</h4>
      <div class="telemetry-log-box" id="sim-telemetry-console">
        [SYSTEM READY] Listening for IoT telemetry sensor events...
      </div>
    </div>
  `;

  const consoleBox = document.getElementById('sim-telemetry-console');

  function appendLog(eventType, payload) {
    const timestamp = new Date().toLocaleTimeString();
    const formatted = `\n[${timestamp}] [EVENT: ${eventType}]\n${JSON.stringify(payload, null, 2)}`;
    if (consoleBox) {
      consoleBox.innerText += formatted;
      consoleBox.scrollTop = consoleBox.scrollHeight;
    }
  }

  async function triggerSimEvent(eventType) {
    const zoneId = document.getElementById('sim-zone-select').value;
    const slotNumber = document.getElementById('sim-slot-input').value.trim();
    const vehiclePlate = document.getElementById('sim-plate-input').value.trim();

    try {
      const res = await apiClient.post('/api/sensors/simulate', {
        zone_id: zoneId,
        event_type: eventType,
        slot_number: slotNumber,
        vehicle_plate: vehiclePlate
      });

      appendLog(eventType, res);
      showToast(`Simulated ${eventType} successfully!`, 'success', 2000);
      window.dispatchEvent(new CustomEvent('smartpark_locations_updated'));
    } catch (err) {
      appendLog("ERROR", { message: err.message });
      showToast(`Simulation error: ${err.message}`, 'error');
    }
  }

  document.getElementById('sim-btn-entry').addEventListener('click', () => triggerSimEvent('VEHICLE_ENTRY'));
  document.getElementById('sim-btn-exit').addEventListener('click', () => triggerSimEvent('VEHICLE_EXIT'));
  document.getElementById('sim-btn-slot-occ').addEventListener('click', () => triggerSimEvent('SLOT_OCCUPIED'));
  document.getElementById('sim-btn-slot-vac').addEventListener('click', () => triggerSimEvent('SLOT_VACATED'));

  document.getElementById('btn-clear-telemetry-log').addEventListener('click', () => {
    if (consoleBox) consoleBox.innerText = '[CONSOLE CLEARED] Ready for incoming telemetry packets...';
  });
}
