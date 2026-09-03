/**
 * SmartPark 125VDC Battery Bank Active Equalizer Modal Component
 * Monitors active inductive cell voltage balancing across 60 series cells powering substation trip coils.
 */

import { showToast } from './toast.js';

export function openBatteryEqualizerModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-ben-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(245,158,11,0.15); color: #f59e0b; margin-bottom: 4px;">
              ⚡ Substation DC Control Power
            </span>
            <h3 class="modal-title">125VDC Station Battery Equalizer</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ben-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Battery Equalizer Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🔋⚡⚙️</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">TOTAL 60-CELL STRING VOLTAGE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">127.4 VDC Float</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Active Inductive Equalization (Max Cell Delta: 8.5 mV - Limit &lt; 20.0 mV)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Internal Resistance: <strong style="color: var(--text-primary);">1.42 mΩ (Optimal)</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Black Start: <strong style="color: var(--status-high-text);">Verified Ready</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-ben" style="width: 100%;">
            Close DC Battery Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ben-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-ben').addEventListener('click', closeModal);
  document.getElementById('modal-ben-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ben-overlay') closeModal();
  });
}
