/**
 * SmartPark Sewage Ejector Duplex Grinder Pump Modal Component
 * Monitors deep basement sanitary lift wet wells and carbide vortex grinder pumps.
 */

import { showToast } from './toast.js';

export function openGrinderPumpModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-gps-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🚽 Sanitary Infrastructure
            </span>
            <h3 class="modal-title">Sewage Ejector Grinder Pump</h3>
          </div>
          <button type="button" class="modal-close" id="modal-gps-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Grinder Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚽⚙️</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">WET WELL LIQUID LEVEL</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">42.0 cm Normal</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Standby Normal (Pump Auto-Trigger &gt; 75.0 cm Depth)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Cutters: <strong style="color: var(--status-high-text);">Radial Carbide Sharp</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Flow Rate: <strong style="color: var(--primary-600);">280 LPM Capacity</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-cycle-grinder-pump" style="width: 100%;">
            ⚡ Run 10-Second Lead Pump Manual Cycle
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-gps-close').addEventListener('click', closeModal);
  document.getElementById('btn-cycle-grinder-pump').addEventListener('click', () => {
    showToast("Grinder pump #1 cycled! Radial carbide cutters rotated and wet well purged.", "success", 2500);
  });
  document.getElementById('modal-gps-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-gps-overlay') closeModal();
  });
}
