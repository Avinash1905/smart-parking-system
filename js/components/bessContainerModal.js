/**
 * SmartPark Battery Energy Storage System (BESS) Modal Component
 * Monitors 2.0 MWh LiFePO4 battery container SoC%, cell temperatures, and peak shaving discharge.
 */

import { showToast } from './toast.js';

export function openBESSContainerModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-bess-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🔋 2.0 MWh Grid Buffer
            </span>
            <h3 class="modal-title">BESS Utility Battery Container</h3>
          </div>
          <button type="button" class="modal-close" id="modal-bess-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Battery Storage Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🔋⚡</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">STORED USABLE ENERGY</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">1,760 kWh (88.0% SoC)</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Peak Shaving Active (350 kW Discharge - 99.4% Health)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Cell Temperature: <strong style="color: var(--status-high-text);">23.4°C Chilled</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Chemistry: <strong style="color: var(--primary-600);">LiFePO₄ Non-Combustible</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-bess" style="width: 100%;">
            Close BESS Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-bess-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-bess').addEventListener('click', closeModal);
  document.getElementById('modal-bess-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-bess-overlay') closeModal();
  });
}
