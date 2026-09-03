/**
 * SmartPark Child Stroller Rental Bay Modal Component
 * Enables families to borrow complimentary UV-C sanitized infant/toddler strollers in parking vestibules.
 */

import { showToast } from './toast.js';

export function openStrollerBayModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-sbn-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              👶 Family Amenities
            </span>
            <h3 class="modal-title">UV-C Sanitized Stroller Pod</h3>
          </div>
          <button type="button" class="modal-close" id="modal-sbn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Stroller Bay Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">👶🛒✨</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">AVAILABLE SANITIZED STROLLERS</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">8 Strollers Ready</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Continuous UV-C Chamber Disinfection Active (Complimentary Family Loan)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--text-primary);">Floor B1 Family Vestibule</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Standard: <strong style="color: var(--primary-600);">ASTM F833 Certified</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-release-stroller" style="width: 100%; justify-content: center;">
            👶 Release Sanitized Stroller STROLLER-UV-03 →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-sbn-close').addEventListener('click', closeModal);
  document.getElementById('btn-release-stroller').addEventListener('click', () => {
    showToast("Stroller STROLLER-UV-03 unlocked! Have a pleasant visit and return to any SmartPark bay.", "success", 3500);
    closeModal();
  });
  document.getElementById('modal-sbn-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-sbn-overlay') closeModal();
  });
}
