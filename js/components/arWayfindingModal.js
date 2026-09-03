/**
 * SmartPark Augmented Reality (AR) Walking Wayfinding Modal Component
 * Overlays live 3D camera navigation chevrons guiding motorists back to their parked vehicle.
 */

import { showToast } from './toast.js';

export function openARWayfindingModal(plate = "KA-05-MN-9921", slot = "B2-44") {
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
    <div class="modal-overlay active" id="modal-ar-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              📱 3D AR Wayfinding
            </span>
            <h3 class="modal-title">AR Camera Walking Navigation</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ar-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- AR Viewport Simulation -->
          <div style="position: relative; height: 220px; background: linear-gradient(135deg, #090d16, #1e293b); border-radius: var(--radius-xl); overflow: hidden; border: 2px solid var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 16px;">
            <!-- Glowing AR Arrow -->
            <div style="font-size: 3.5rem; color: #38bdf8; text-shadow: 0 0 20px rgba(56,189,248,0.8); animation: pulse 1.5s infinite;">
              ⬆️
            </div>
            <div style="background: rgba(0,0,0,0.7); padding: 6px 14px; border-radius: 20px; color: #fff; font-size: 0.85rem; font-weight: 700; margin-top: 8px;">
              Walk Straight 28m → Turn Right to Stall ${slot}
            </div>

            <!-- Plate Badge Overlay -->
            <div style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.8); padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 0.75rem; color: #38bdf8;">
              CAR: ${plate}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Distance Remaining: <strong style="color: var(--status-high-text);">64.5 Meters (48s)</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>BLE Positioning: <strong style="color: var(--primary-600);">± 0.8m Accuracy</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-ar" style="width: 100%;">
            Close AR Navigation
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ar-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-ar').addEventListener('click', closeModal);
  document.getElementById('modal-ar-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ar-overlay') closeModal();
  });
}
