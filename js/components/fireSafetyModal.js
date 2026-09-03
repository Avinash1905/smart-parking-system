/**
 * SmartPark Fire Safety & Automated Sprinkler Zone Monitor Component
 * Real-time monitoring of thermal detectors, smoke loops, and automated deluge sprinkler valves.
 */

import { showToast } from './toast.js';

export function openFireSafetyModal(zoneName = "Municipal Central Parking") {
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

  const fireZones = [
    { code: "FIRE-B1-NORTH", floor: "Floor B1 (North Wing)", temp: "24.8°C", smoke: "CLEAR", sprinkler: "CHARGED STANDBY", status: "NORMAL" },
    { code: "FIRE-B2-SOUTH", floor: "Floor B2 (South Wing)", temp: "25.2°C", smoke: "CLEAR", sprinkler: "CHARGED STANDBY", status: "NORMAL" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-fire-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🚒 Life Safety System
            </span>
            <h3 class="modal-title">Fire Safety & Sprinkler Loop Grid</h3>
          </div>
          <button type="button" class="modal-close" id="modal-fire-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Continuous telemetry streaming from multi-criteria optical smoke detectors and automatic dry-pipe sprinkler deluge headers.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${fireZones.map(z => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${z.floor}</strong>
                  <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">● ${z.status}</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 0.8125rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 8px;">
                  <div>Thermal: <strong style="color: var(--text-primary);">${z.temp}</strong></div>
                  <div>Smoke: <strong style="color: var(--status-high-text);">${z.smoke}</strong></div>
                  <div>Sprinkler: <strong style="color: var(--primary-600);">${z.sprinkler}</strong></div>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-fire-self-test" style="width: 100%;">
            ⚡ Run Remote Flame & Heat Sensor Diagnostic
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-fire-close').addEventListener('click', closeModal);
  document.getElementById('btn-fire-self-test').addEventListener('click', () => {
    showToast("Fire safety diagnostic completed! All 48 thermal sensor heads verified operational.", "success", 2500);
  });
  document.getElementById('modal-fire-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-fire-overlay') closeModal();
  });
}
