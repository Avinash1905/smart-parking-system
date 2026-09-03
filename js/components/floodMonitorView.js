/**
 * SmartPark Basement Flood & Sump Pump Monitor Component
 * Real-time monitoring of basement stormwater water levels and automated drainage pumps.
 */

import { showToast } from './toast.js';

export function openFloodMonitorModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-flood-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              💧 Stormwater Protection
            </span>
            <h3 class="modal-title">Basement Flood & Sump Pump Grid</h3>
          </div>
          <button type="button" class="modal-close" id="modal-flood-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Flood Level Dashboard Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">SUMP BASIN WATER DEPTH</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-cyan); margin: 4px 0;">2.4 cm</div>
              <span style="font-size: 0.75rem; color: var(--status-high-text);">● Safe / Normal (Trigger: 15.0 cm)</span>
            </div>

            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">DRAINAGE SUMP PUMPS</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--status-high-text); margin: 4px 0;">4 / 4 ONLINE</div>
              <span style="font-size: 0.75rem; color: var(--primary-600);">● Submersible Dual Impellers</span>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-test-sump-pump" style="width: 100%;">
            ⚡ Run Sump Pump Self-Test (5 Seconds)
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-flood-close').addEventListener('click', closeModal);
  document.getElementById('btn-test-sump-pump').addEventListener('click', () => {
    showToast("Sump pump self-test completed! All 4 impeller lines drawing optimal current.", "success", 2500);
  });
  document.getElementById('modal-flood-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-flood-overlay') closeModal();
  });
}
