/**
 * SmartPark Car Wash Reverse Osmosis (RO) & Water Recycling Modal Component
 * Monitors ultra-pure spot-free rinse water (TDS < 20 ppm) and 85% closed-loop wash reclamation.
 */

import { showToast } from './toast.js';

export function openCarwashROModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-cro-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🚿 Eco Car Wash
            </span>
            <h3 class="modal-title">Spot-Free RO Wash Bay</h3>
          </div>
          <button type="button" class="modal-close" id="modal-cro-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- RO Water Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">PURIFIED RINSE TDS MINERALS</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--accent-cyan); margin: 4px 0;">12.4 PPM</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Zero-Residue Spot-Free Shine (85% Water Recycled)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>High-Pressure Pump: <strong style="color: var(--text-primary);">95 Bar Pressure</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Holding Tank: <strong style="color: var(--primary-600);">12,500 L Ready</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-start-wash-bay" style="width: 100%; justify-content: center;">
            🚗 Start Automated Spot-Free Wash Bay #1 →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-cro-close').addEventListener('click', closeModal);
  document.getElementById('btn-start-wash-bay').addEventListener('click', () => {
    showToast("Spot-free reverse osmosis wash bay activated! High-pressure water arches engaged.", "success", 3000);
    closeModal();
  });
  document.getElementById('modal-cro-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-cro-overlay') closeModal();
  });
}
