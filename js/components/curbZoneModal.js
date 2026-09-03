/**
 * SmartPark Dynamic Variable Curb Management Modal Component
 * Displays live digital curb policies (freight loading, short-stay parking, ride-hail pickup).
 */

import { showToast } from './toast.js';

export function openCurbZoneModal() {
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

  const curbs = [
    { code: "CURB-MG-01", street: "MG Road Boulevard", window: "08:00 - 11:00 AM", policy: "🚚 COMMERCIAL FREIGHT ONLY", dwell: "Max 30 Mins", status: "ENFORCING" },
    { code: "CURB-INDIRA-02", street: "100ft Road Indiranagar", window: "11:00 AM - 06:00 PM", policy: "🚗 SHORT-STAY CIVIC PARKING", dwell: "Max 60 Mins", status: "ENFORCING" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-curb-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Smart Curb Allocation</span>
            <h3 class="modal-title">Dynamic Variable Curb Space</h3>
          </div>
          <button type="button" class="modal-close" id="modal-curb-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Dynamic street-side digital signs reallocate curbs throughout the day for maximum urban throughput.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${curbs.map(c => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${c.street}</strong>
                  <strong style="font-family: monospace; color: var(--primary-600); font-size: 0.9rem;">${c.code}</strong>
                </div>

                <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin: 6px 0;">
                  <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">CURRENT ACTIVE POLICY:</span>
                  <strong style="font-size: 0.95rem; color: var(--status-high-text);">${c.policy}</strong>
                </div>

                <div style="font-size: 0.78rem; color: var(--text-secondary);">
                  Window: <strong>${c.window}</strong> • Dwell Limit: <strong>${c.dwell}</strong>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-curb" style="width: 100%;">
            Close Curb Management
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-curb-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-curb').addEventListener('click', closeModal);
  document.getElementById('modal-curb-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-curb-overlay') closeModal();
  });
}
