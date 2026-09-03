/**
 * SmartPark EV Charging Hub & Smart Grid Component
 * Enables EV drivers to discover fast-charging stalls, monitor live kW charging speeds,
 * and track carbon offset savings.
 */

import { showToast } from './toast.js';

export function openEVChargingModal(zone) {
  let modalContainer = document.getElementById('modals-root');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modals-root';
    document.body.appendChild(modalContainer);
  }

  function closeModal() {
    const overlay = document.querySelector('.modal-overlay.active');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    }
  }

  const zoneName = zone ? zone.name : "Municipal Central Parking";

  const modalHtml = `
    <div class="modal-overlay active" id="modal-ev-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-ev" style="margin-bottom: 4px;">⚡ Smart Grid Station</span>
            <h3 class="modal-title">EV Fast Charging Network</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ev-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- EV Hub Banner -->
          <div class="ev-gauge-container">
            <div style="font-size: 2.5rem;">⚡</div>
            <div style="flex: 1;">
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 2px;">
                ${zoneName} Fast Hub
              </h4>
              <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.4;">
                High-capacity DC Fast Charging powered by 100% certified clean solar grid energy.
              </p>
            </div>
          </div>

          <!-- Connector Selection Grid -->
          <div style="margin-bottom: 18px;">
            <label class="input-label" style="margin-bottom: 8px;">Select Charger Connector</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="simulator-btn-card" id="conn-ccs2" style="border-color: var(--accent-cyan);">
                <strong style="color: var(--text-primary);">CCS2 (DC Fast Charge)</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">60 kW Output • ₹14.50 / kWh</span>
                <span class="badge badge-ev" style="margin-top: auto;">Fast (0-80% in 35m)</span>
              </div>
              <div class="simulator-btn-card" id="conn-type2">
                <strong style="color: var(--text-primary);">Type 2 (AC Destination)</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">22 kW Output • ₹11.00 / kWh</span>
                <span class="badge badge-public" style="margin-top: auto;">Standard (2-3 hrs)</span>
              </div>
            </div>
          </div>

          <!-- Live Energy & Carbon Metrics Box -->
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center;">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">CHARGING POWER</span>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan);">60.0 kW</div>
              </div>
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">ENERGY CONSUMED</span>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">18.4 kWh</div>
              </div>
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">CO₂ REDUCTION</span>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--status-high-text);">15.1 kg</div>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-start-ev-charge" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);">
            Start Fast Charge Session →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ev-close').addEventListener('click', closeModal);
  document.getElementById('modal-ev-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ev-overlay') closeModal();
  });

  document.getElementById('btn-start-ev-charge').addEventListener('click', () => {
    showToast("EV charging initialized! Real-time telemetry monitoring active.", "success", 2500);
    closeModal();
  });
}
