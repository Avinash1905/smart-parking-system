/**
 * SmartPark Laser Wheel Rim Alignment & Curb-Rash Prevention Modal Component
 * Displays 532nm green laser centerline projections to prevent alloy wheel scrapes.
 */

import { showToast } from './toast.js';

export function openRimAlignmentModal(slotCode = "A-01") {
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
    <div class="modal-overlay active" id="modal-rim-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🎯 Precision Optical Guide
            </span>
            <h3 class="modal-title">Laser Rim Alignment & Curb Guard</h3>
          </div>
          <button type="button" class="modal-close" id="modal-rim-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Laser Alignment Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🎯🟢</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">WHEEL RIM POSITIONING</span>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">Perfect Center Aligned</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 532nm Green Laser Crosshair Projected on Stall Floor
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Left Curb Gap: <strong style="color: var(--status-high-text);">14.2 cm Safe Buffer</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Right Curb Gap: <strong style="color: var(--status-high-text);">15.8 cm Safe Buffer</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-rim" style="width: 100%;">
            Close Laser Alignment
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-rim-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-rim').addEventListener('click', closeModal);
  document.getElementById('modal-rim-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-rim-overlay') closeModal();
  });
}
