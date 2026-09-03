/**
 * SmartPark Vehicle Rear Overhang Laser Curtain Modal Component
 * Monitors drive aisle laser curtains tracking rear bumper encroachment (4.2 cm vs 15.0 cm limit).
 */

import { showToast } from './toast.js';

export function openTailClearanceModal(plate = "KA-01-EQ-9988") {
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
    <div class="modal-overlay active" id="modal-tcn-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              📐 Stall Boundary Compliance
            </span>
            <h3 class="modal-title">Bumper Overhang Laser Curtain</h3>
          </div>
          <button type="button" class="modal-close" id="modal-tcn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Overhang Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚗📐✨</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">MEASURED BUMPER ENCROACHMENT</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">4.2 cm Overhang</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Parked Within Perimeter (Allowable Limit &lt; 15.0 cm - 72% Margin)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Vehicle: <strong style="color: var(--text-primary);">${plate}</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Drive Aisle Width: <strong style="color: var(--primary-600);">6.85m Retained</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-tcn" style="width: 100%;">
            Close Overhang Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-tcn-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-tcn').addEventListener('click', closeModal);
  document.getElementById('modal-tcn-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-tcn-overlay') closeModal();
  });
}
