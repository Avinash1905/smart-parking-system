/**
 * SmartPark Driver Tire Inflator & Air Dispenser Modal Component
 * Enables motorists to set digital PSI target levels and use free nitrogen tire inflation.
 */

import { showToast } from './toast.js';

export function openTireInflatorModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-air-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              💨 Driver Amenity
            </span>
            <h3 class="modal-title">Digital Tire Inflator Station</h3>
          </div>
          <button type="button" class="modal-close" id="modal-air-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- PSI Target Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">PRESET TARGET TIRE PRESSURE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--accent-cyan); margin: 4px 0;">33.0 PSI</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 96.5% Nitrogen Purge Active (Complimentary Free)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Tank Pressure: <strong style="color: var(--text-primary);">120.0 PSI</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--primary-600);">Floor B1 Air Bay #1</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-unlock-air-hose" style="width: 100%; justify-content: center;">
            💨 Unlock Air Hose & Dispense Nitrogen
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-air-close').addEventListener('click', closeModal);
  document.getElementById('btn-unlock-air-hose').addEventListener('click', () => {
    showToast("Tire inflator hose unlocked! Attach chuck to valve stem for automated 33.0 PSI auto-shutoff fill.", "success", 3000);
    closeModal();
  });
  document.getElementById('modal-air-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-air-overlay') closeModal();
  });
}
