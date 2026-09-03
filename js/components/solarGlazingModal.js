/**
 * SmartPark Solar Low-E Glazing & Thermal Shield Modal Component
 * Monitors architectural Low-E glass coatings, solar heat rejection (SHGC 0.28), and daylight transmission.
 */

import { showToast } from './toast.js';

export function openSolarGlazingModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-glz-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🏢 Passive Green Architecture
            </span>
            <h3 class="modal-title">Low-E Solar Glazing Heat Shield</h3>
          </div>
          <button type="button" class="modal-close" id="modal-glz-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Heat Rejection Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">SOLAR INFRARED HEAT REJECTED</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">72.0% Heat Blocked</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Low-E SHGC: 0.28 (62.4% Visible Light Transmittance)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>U-Factor: <strong style="color: var(--text-primary);">1.15 W/m²K</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Glass Config: <strong style="color: var(--primary-600);">Double Argon Low-E</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-glz" style="width: 100%;">
            Close Glazing Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-glz-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-glz').addEventListener('click', closeModal);
  document.getElementById('modal-glz-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-glz-overlay') closeModal();
  });
}
