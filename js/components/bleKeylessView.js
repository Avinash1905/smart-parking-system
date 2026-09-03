/**
 * SmartPark Hands-Free BLE Keyless Gate Entry Component
 * Demonstrates proximity-based Bluetooth Low Energy gate barrier release.
 */

import { showToast } from './toast.js';

export function openBLEKeylessModal() {
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

  const modalHtml = `
    <div class="modal-overlay active" id="modal-ble-overlay">
      <div class="modal-content" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              📶 Bluetooth Beacon
            </span>
            <h3 class="modal-title">Hands-Free BLE Gate Entry</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ble-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Proximity Pulse Visualizer -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem; margin-bottom: 8px;">📶</div>
            <strong style="font-size: 1.1rem; color: var(--text-primary); display: block;">SmartPark BLE Auto-Gate</strong>
            <p style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 16px;">
              Your smartphone automatically communicates with roadside beacons for zero-stop entry.
            </p>

            <div style="background: var(--bg-surface); border-radius: var(--radius-lg); padding: 14px; display: flex; justify-content: space-around;">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">BEACON SIGNAL</span>
                <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-cyan);">-62 dBm (Strong)</div>
              </div>
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">DISTANCE TO GATE</span>
                <div style="font-size: 1.1rem; font-weight: 800; color: var(--status-high-text);">1.8 Meters</div>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-simulate-ble-approach" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);">
            🚗 Drive Forward (Trigger Auto-Lift)
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ble-close').addEventListener('click', closeModal);
  document.getElementById('modal-ble-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ble-overlay') closeModal();
  });

  document.getElementById('btn-simulate-ble-approach').addEventListener('click', () => {
    showToast("BLE beacon authenticated! Boom barrier lifted automatically.", "success", 2500);
    closeModal();
  });
}
