/**
 * SmartPark Weigh-In-Motion (WIM) Axle Load Limiter Modal Component
 * Displays in-ground piezoelectric scale measurements and structural gross vehicle weight limits.
 */

import { showToast } from './toast.js';

export function openAxleWeightModal(plate = "KA-01-MJ-5890") {
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
    <div class="modal-overlay active" id="modal-axle-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              ⚖️ Weigh-In-Motion (WIM)
            </span>
            <h3 class="modal-title">Vehicle Axle Load Scale</h3>
          </div>
          <button type="button" class="modal-close" id="modal-axle-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Weight Metric Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">GROSS VEHICLE WEIGHT (GVW)</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">1.80 Metric Tons</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Safe Deck Load (Max Structural Limit: 3.50 Tons)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Front Axle: <strong style="color: var(--text-primary);">920 kg</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Rear Axle: <strong style="color: var(--text-primary);">880 kg</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-axle" style="width: 100%;">
            Close Weight Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-axle-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-axle').addEventListener('click', closeModal);
  document.getElementById('modal-axle-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-axle-overlay') closeModal();
  });
}
