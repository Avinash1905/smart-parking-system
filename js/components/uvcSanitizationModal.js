/**
 * SmartPark UV-C Robotic Surface Sanitization Modal Component
 * Displays autonomous germicidal sterilization cycles and cleanliness certification for parking bays.
 */

import { showToast } from './toast.js';

export function openUVCSanitizationModal(slotCode = "A-24") {
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
    <div class="modal-overlay active" id="modal-uvc-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              ✨ Hygiene & Sterilization
            </span>
            <h3 class="modal-title">UV-C Robotic Bay Sanitization</h3>
          </div>
          <button type="button" class="modal-close" id="modal-uvc-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Sanitization Certificate Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 6px;">✨</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 99.99% GERMICIDAL CERTIFIED
            </span>
            <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 8px 0 4px;">
              Bay ${slotCode} Sterilized
            </h4>
            <span style="font-size: 0.8125rem; color: var(--text-secondary);">
              Autonomous UV-C rover ROBO-STERIL-04 completed a 28.4 mJ/cm² germicidal light sweep.
            </span>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-trigger-clean-pass" style="width: 100%;">
            ⚡ Trigger Immediate Post-Session Disinfection Sweep
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-uvc-close').addEventListener('click', closeModal);
  document.getElementById('btn-trigger-clean-pass').addEventListener('click', () => {
    showToast(`Autonomous UV-C rover dispatched to Bay ${slotCode}! Sanitization cycle started.`, "success", 2500);
    closeModal();
  });
  document.getElementById('modal-uvc-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-uvc-overlay') closeModal();
  });
}
