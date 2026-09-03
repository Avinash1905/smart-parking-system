/**
 * SmartPark EV Battery Thermal Runaway & Mist Suppression Modal Component
 * Monitors infrared thermal hotspot cameras and underbody 140-bar water mist nozzles.
 */

import { showToast } from './toast.js';

export function openEVThermalSuppressionModal(slotCode = "A-03") {
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
    <div class="modal-overlay active" id="modal-ev-fire-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🛡️ Lithium Fire Safety
            </span>
            <h3 class="modal-title">EV Battery Thermal Suppression</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ev-fire-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Thermal Health Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">BATTERY PACK IR TEMPERATURE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">31.5°C</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Normal Charging Range (&lt; 45°C)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Underbody Nozzles: <strong style="color: var(--primary-600);">140 Bar Mist Ready</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>FLIR Thermal Cam: <strong style="color: var(--status-high-text);">0 Hotspots</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-ev-fire" style="width: 100%;">
            Close Thermal Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ev-fire-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-ev-fire').addEventListener('click', closeModal);
  document.getElementById('modal-ev-fire-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ev-fire-overlay') closeModal();
  });
}
