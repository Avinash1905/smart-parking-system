/**
 * SmartPark Driver Tire Tread Depth & Wear Laser Profiler Modal Component
 * Displays 3D optical tire groove measurements and remaining tire mileage lifespan.
 */

import { showToast } from './toast.js';

export function openTreadDepthModal(plate = "KA-01-MJ-5890") {
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
    <div class="modal-overlay active" id="modal-tread-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🔍 Complimentary Safety Scan
            </span>
            <h3 class="modal-title">Tire Tread Depth Laser Profiler</h3>
          </div>
          <button type="button" class="modal-close" id="modal-tread-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Tread Depth Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">AVERAGE TREAD GROOVE DEPTH</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">5.8 mm</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Excellent Grip (~28,000 km Remaining)
            </span>
          </div>

          <!-- 4 Tires Diagnostic Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Front Left: <strong style="color: var(--text-primary);">6.4 mm</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Front Right: <strong style="color: var(--text-primary);">6.2 mm</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Rear Left: <strong style="color: var(--text-primary);">5.8 mm</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Rear Right: <strong style="color: var(--text-primary);">5.9 mm</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-tread" style="width: 100%;">
            Close Tread Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-tread-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-tread').addEventListener('click', closeModal);
  document.getElementById('modal-tread-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-tread-overlay') closeModal();
  });
}
