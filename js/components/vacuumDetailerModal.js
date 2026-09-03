/**
 * SmartPark Vehicle Vacuum Cleaner & Interior Detailer Modal Component
 * Enables motorists to use complimentary 5.5 HP cyclonic vacuums and cedarwood fragrance wands.
 */

import { showToast } from './toast.js';

export function openVacuumDetailerModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-vds-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🚘 Driver Auto Care
            </span>
            <h3 class="modal-title">High-Power Vacuum & Detail Kiosk</h3>
          </div>
          <button type="button" class="modal-close" id="modal-vds-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Vacuum Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚘🧹💨</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">COMPLIMENTARY DRIVER AMENITY</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">5.5 HP Dual-Motor Vacuum</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 240 CFM Cyclonic Suction (8-Min Free Session + Cedarwood Scent)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--text-primary);">Floor B1 Care Bay #3</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Detailing Nozzle: <strong style="color: var(--primary-600);">Claw &amp; Crevice Wand</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-start-vacuum-cycle" style="width: 100%; justify-content: center;">
            💨 Unlock Vacuum Wand & Start 8-Min Free Suction →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-vds-close').addEventListener('click', closeModal);
  document.getElementById('btn-start-vacuum-cycle').addEventListener('click', () => {
    showToast("5.5 HP Cyclonic vacuum wand engaged! Hose holder unlocked for 8 minutes.", "success", 3500);
    closeModal();
  });
  document.getElementById('modal-vds-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-vds-overlay') closeModal();
  });
}
