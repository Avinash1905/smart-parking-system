/**
 * SmartPark Dehumidification & Condensation Control Modal Component
 * Monitors desiccant moisture extractors maintaining dry concrete drive aisles in deep underground decks.
 */

import { showToast } from './toast.js';

export function openDehumidifierModal(zoneName = "Municipal Central Parking") {
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

  const units = [
    { code: "DHUM-B2-01", loc: "Floor B2 Deep Aisle", rh: "52.4% RH", water: "48.5 L Recovered", status: "OPTIMAL" },
    { code: "DHUM-B3-02", loc: "Floor B3 Lowest Vault", rh: "53.1% RH", water: "56.2 L Recovered", status: "OPTIMAL" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-dhum-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              💧 Moisture Control
            </span>
            <h3 class="modal-title">Basement Dehumidification Grid</h3>
          </div>
          <button type="button" class="modal-close" id="modal-dhum-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Humidity Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">AVERAGE BASEMENT RELATIVE HUMIDITY</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--accent-cyan); margin: 4px 0;">52.4% RH</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Condensation Free (Target &lt; 55% RH)
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${units.map(u => `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${u.loc}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); font-family: monospace;">${u.code} • ${u.water}</div>
                </div>
                <strong style="color: var(--status-high-text); font-size: 0.95rem;">${u.rh}</strong>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-dhum" style="width: 100%;">
            Close Dehumidifier Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-dhum-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-dhum').addEventListener('click', closeModal);
  document.getElementById('modal-dhum-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-dhum-overlay') closeModal();
  });
}
