/**
 * SmartPark Driver Windshield Washer Fluid Dispenser Modal Component
 * Enables motorists to top up vehicle wiper fluid reservoirs using automated complimentary dispensers.
 */

import { showToast } from './toast.js';

export function openWasherFluidModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-wfs-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🚘 Driver Amenity
            </span>
            <h3 class="modal-title">Windshield Washer Fluid Dispenser</h3>
          </div>
          <button type="button" class="modal-close" id="modal-wfs-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Fluid Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚘💧</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">FREE DRIVER CARE DISPENSER</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">240.0 Liters Reserve</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● All-Season De-Bug Formulation (Free Refills up to 2.0L)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--text-primary);">Floor B1 Care Bay #2</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Dispensed Today: <strong style="color: var(--primary-600);">14.5 Liters</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-unlock-fluid-wand" style="width: 100%; justify-content: center;">
            💧 Unlock Fluid Nozzle Wand & Dispense Refill →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-wfs-close').addEventListener('click', closeModal);
  document.getElementById('btn-unlock-fluid-wand').addEventListener('click', () => {
    showToast("Washer fluid nozzle wand unlocked! Insert nozzle into wiper tank reservoir to fill.", "success", 3000);
    closeModal();
  });
  document.getElementById('modal-wfs-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-wfs-overlay') closeModal();
  });
}
