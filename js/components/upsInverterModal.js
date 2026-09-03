/**
 * SmartPark UPS Inverter & Barrier Emergency Power Component
 * Real-time monitoring of pure sine-wave battery inverters and automated backup power continuity.
 */

import { showToast } from './toast.js';

export function openUPSInverterModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-ups-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              ⚡ Power Continuity
            </span>
            <h3 class="modal-title">Barrier UPS & Battery Inverter Grid</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ups-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Power Grid Status Metrics -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">AC MAINS SUPPLY</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--status-high-text); margin: 4px 0;">232.4 V</div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">50.0 Hz Pure Sine Wave</span>
            </div>

            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">BATTERY BACKUP RUNTIME</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary-600); margin: 4px 0;">8.5 Hours</div>
              <span style="font-size: 0.75rem; color: var(--status-high-text);">● 100% Barrier Operations</span>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-simulate-grid-fail" style="width: 100%;">
            ⚡ Simulate AC Mains Power Outage (Test Switchover)
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ups-close').addEventListener('click', closeModal);
  document.getElementById('btn-simulate-grid-fail').addEventListener('click', () => {
    showToast("Grid failover simulated! UPS transferred barrier load in 4 milliseconds (Zero Glitch).", "success", 2500);
  });
  document.getElementById('modal-ups-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ups-overlay') closeModal();
  });
}
