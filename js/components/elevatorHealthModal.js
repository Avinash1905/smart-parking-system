/**
 * SmartPark Elevator Predictive Maintenance Modal Component
 * Monitors passenger elevator door cycles, hoist cable vibration, and floor leveling tolerances.
 */

import { showToast } from './toast.js';

export function openElevatorHealthModal(zoneName = "Municipal Central Parking") {
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

  const elevs = [
    { code: "ELEV-TRACTION-01", loc: "North Core Passenger", floor: "Floor G (Main)", error: "1.2 mm Leveling", cycles: "42,890 Cycles", status: "OPTIMAL" },
    { code: "ELEV-TRACTION-02", loc: "South Core Passenger", floor: "Floor B2", error: "0.8 mm Leveling", cycles: "38,120 Cycles", status: "OPTIMAL" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-elev-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🛗 Vertical Mobility
            </span>
            <h3 class="modal-title">Elevator Predictive Health</h3>
          </div>
          <button type="button" class="modal-close" id="modal-elev-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Continuous IoT telemetry tracking hoist cable vibration, motor winding temperature, and threshold tolerances.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${elevs.map(e => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${e.loc}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); font-family: monospace;">${e.code} • At ${e.floor}</div>
                  <span style="font-size: 0.75rem; color: var(--text-secondary);">${e.error} • ${e.cycles}</span>
                </div>

                <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
                  ● ${e.status}
                </span>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-elev" style="width: 100%;">
            Close Elevator Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-elev-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-elev').addEventListener('click', closeModal);
  document.getElementById('modal-elev-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-elev-overlay') closeModal();
  });
}
