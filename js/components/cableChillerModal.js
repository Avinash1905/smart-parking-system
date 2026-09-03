/**
 * SmartPark EV Fast-Charger Cable Liquid Chiller Modal Component
 * Monitors 500A liquid-cooled CCS2 cable refrigeration loops and dielectric coolant flow rates.
 */

import { showToast } from './toast.js';

export function openCableChillerModal(slotCode = "A-03") {
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
    <div class="modal-overlay active" id="modal-chl-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              ❄️ High-Current EV Cooling
            </span>
            <h3 class="modal-title">500A Liquid-Cooled Cable Chiller</h3>
          </div>
          <button type="button" class="modal-close" id="modal-chl-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Chiller Metric Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">GLYCOL COOLANT TEMPERATURE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--accent-cyan); margin: 4px 0;">18.5°C</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Chilled Nominal (Target &lt; 25.0°C at 500 Amps)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Coolant Flow: <strong style="color: var(--status-high-text);">4.2 Liters/Min</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Loop Pressure: <strong style="color: var(--primary-600);">2.4 Bar Closed Loop</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-chl" style="width: 100%;">
            Close Cable Chiller Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-chl-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-chl').addEventListener('click', closeModal);
  document.getElementById('modal-chl-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-chl-overlay') closeModal();
  });
}
