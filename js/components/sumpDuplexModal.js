/**
 * SmartPark Sump Pit Dual-Duplex Wastewater Pump Controller Modal Component
 * Monitors lead-lag alternating submersible pumps, pit water depths, and flood prevention alarms.
 */

import { showToast } from './toast.js';

export function openSumpDuplexModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-sump-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🌊 Flood Drainage
            </span>
            <h3 class="modal-title">Sump Pit Dual-Duplex Pumps</h3>
          </div>
          <button type="button" class="modal-close" id="modal-sump-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Pit Depth Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">PIT WATER LEVEL</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--accent-cyan); margin: 4px 0;">24.5 cm</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Low Normal (High Float Trigger: 85 cm)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Pump 1 (Lead): <strong style="color: var(--status-high-text);">STANDBY READY</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Pump 2 (Lag Backup): <strong style="color: var(--primary-600);">STANDBY READY</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-test-pump-cycle" style="width: 100%;">
            ⚡ Run 5-Second Impeller Maintenance Spin
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-sump-close').addEventListener('click', closeModal);
  document.getElementById('btn-test-pump-cycle').addEventListener('click', () => {
    showToast("Pump 1 lead impeller spun for 5 seconds! Flow sensor verified clear.", "success", 2500);
  });
  document.getElementById('modal-sump-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-sump-overlay') closeModal();
  });
}
