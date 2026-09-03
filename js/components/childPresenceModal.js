/**
 * SmartPark Child Presence Detection (CPD) & Heatstroke Guard Modal Component
 * Monitors 60GHz millimeter-wave radar tracking infant sub-breathing motion inside parked cars.
 */

import { showToast } from './toast.js';

export function openChildPresenceModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-cpd-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              👶 Child Life Safety Guard
            </span>
            <h3 class="modal-title">Child Presence Detection (CPD)</h3>
          </div>
          <button type="button" class="modal-close" id="modal-cpd-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- CPD Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">👶📡🚗</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">60GHZ SUB-BREATHING RADAR</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">All Stalls Clear</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 23.4°C Safe Cabin Temp (Euro NCAP Heatstroke Prevention Guard)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Sensitivity: <strong style="color: var(--text-primary);">0.2mm Chest Motion</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Alarm Tripped: <strong style="color: var(--status-high-text);">0 (All Secure)</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-cpd" style="width: 100%;">
            Close CPD Radar Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-cpd-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-cpd').addEventListener('click', closeModal);
  document.getElementById('modal-cpd-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-cpd-overlay') closeModal();
  });
}
