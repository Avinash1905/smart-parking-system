/**
 * SmartPark High-Pressure Water Mist EV Quarantine Pod Modal Component
 * Monitors 140-bar micro-droplet deluge nozzles (45 microns) for EV lithium thermal runaway suppression.
 */

import { showToast } from './toast.js';

export function openWaterMistModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-wmn-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(239,68,68,0.15); color: var(--status-critical); margin-bottom: 4px;">
              🔥 EV Battery Fire Quarantine
            </span>
            <h3 class="modal-title">High-Pressure Water Mist Pod</h3>
          </div>
          <button type="button" class="modal-close" id="modal-wmn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Water Mist Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚿🔋🛡️</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">DELUGE SYSTEM OPERATING PRESSURE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">140.0 Bar (45µm Mist)</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Deluge Valves Armed (12,000L Dedicated Reservoir - NFPA 750)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--text-primary);">Floor B1 Quarantine Bay</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Cooling Efficiency: <strong style="color: var(--status-high-text);">98.4% Heat Extraction</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-wmn" style="width: 100%;">
            Close Water Mist Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-wmn-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-wmn').addEventListener('click', closeModal);
  document.getElementById('modal-wmn-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-wmn-overlay') closeModal();
  });
}
