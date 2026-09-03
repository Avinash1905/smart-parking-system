/**
 * SmartPark Floor Epoxy Skid Resistance & Friction Modal Component
 * Monitors British Pendulum Number (BPN) surface traction on ramps and warns of slick spots.
 */

import { showToast } from './toast.js';

export function openSkidResistanceModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-skid-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🚗 Tire Traction Safety
            </span>
            <h3 class="modal-title">Deck Floor Skid Resistance</h3>
          </div>
          <button type="button" class="modal-close" id="modal-skid-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Friction Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">SURFACE FRICTION COEFFICIENT</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">64.5 BPN</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● High Traction (Safe Grip Threshold &gt; 45 BPN)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Coating Type: <strong style="color: var(--text-primary);">Quartz Polyurethane</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Ramp Grip Rating: <strong style="color: var(--status-high-text);">Class 1 Optimal</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-skid" style="width: 100%;">
            Close Traction Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-skid-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-skid').addEventListener('click', closeModal);
  document.getElementById('modal-skid-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-skid-overlay') closeModal();
  });
}
