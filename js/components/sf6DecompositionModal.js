/**
 * SmartPark Substation SF6 Decomposition Spectrometer Modal Component
 * Displays infrared photoacoustic spectroscopy gas chambers (SO2: 0.45 ppm vs 5.0 ppm limit).
 */

import { showToast } from './toast.js';

export function openSF6DecompositionModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-sds-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              ⚡ Substation Gas Chemistry
            </span>
            <h3 class="modal-title">SF6 Photoacoustic Spectrometer</h3>
          </div>
          <button type="button" class="modal-close" id="modal-sds-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- SF6 Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">⚡🧪🔬</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">MEASURED SO2 BYPRODUCT CONCENTRATION</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">0.45 ppm SO2</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Pure Insulating Gas Quality (Allowable Threshold: &lt; 5.0 ppm - IEC 60480)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>HF Decomposition: <strong style="color: var(--text-primary);">0.12 ppm (Safe)</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Gas Dewpoint: <strong style="color: var(--primary-600);">-42.5°C Dry</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-sds" style="width: 100%;">
            Close Spectrometer Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-sds-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-sds').addEventListener('click', closeModal);
  document.getElementById('modal-sds-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-sds-overlay') closeModal();
  });
}
