/**
 * SmartPark Speed Radar & Velocity Violation Modal Component
 * Displays 24GHz radar speed captures and automated parking aisle speed limit enforcement citations.
 */

import { showToast } from './toast.js';

export function openSpeedRadarModal(plate = "KA-01-EQ-9988") {
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
    <div class="modal-overlay active" id="modal-spd-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              ⚡ Traffic Safety Enforcement
            </span>
            <h3 class="modal-title">Drive Aisle Speed Violation</h3>
          </div>
          <button type="button" class="modal-close" id="modal-spd-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Speed Violation Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">MEASURED AISLE VELOCITY</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #ef4444; margin: 4px 0;">26.5 km/h</div>
            <span class="badge" style="background: rgba(239,68,68,0.2); color: #ef4444;">
              ● 11.5 km/h Over Limit (Posted Garage Limit: 15.0 km/h)
            </span>
          </div>

          <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 16px; font-size: 0.8125rem; color: var(--text-secondary); display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>Vehicle: <strong>${plate}</strong></div>
            <div>Safety Fine: <strong style="color: #ef4444;">₹500.00 Added</strong></div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-spd" style="width: 100%;">
            Close Speed Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-spd-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-spd').addEventListener('click', closeModal);
  document.getElementById('modal-spd-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-spd-overlay') closeModal();
  });
}
