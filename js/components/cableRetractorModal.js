/**
 * SmartPark Overhead EV Cable Retractor & Motorized Reel Component
 * Displays automated ceiling-mounted EV charging cable drops for clean, trip-free charging bays.
 */

import { showToast } from './toast.js';

export function openCableRetractorModal(slotCode = "A-03") {
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
    <div class="modal-overlay active" id="modal-reel-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              ⚡ Ergonomic EV Charging
            </span>
            <h3 class="modal-title">Overhead Motorized Cable Drop</h3>
          </div>
          <button type="button" class="modal-close" id="modal-reel-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 6px;">🔌</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● READY FOR VEHICLE
            </span>
            <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 8px 0 4px;">
              Bay ${slotCode} CCS2 Cable
            </h4>
            <span style="font-size: 0.8125rem; color: var(--text-secondary);">
              Motorized winch lowers heavy 60kW DC liquid-cooled charging cable directly beside vehicle charge port.
            </span>
          </div>

          <button type="button" class="btn btn-primary" id="btn-lower-ev-cable" style="width: 100%; justify-content: center;">
            ⬇️ Lower Charging Cable from Ceiling
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-reel-close').addEventListener('click', closeModal);
  document.getElementById('btn-lower-ev-cable').addEventListener('click', () => {
    showToast(`CCS2 charging cable lowered to waist height at Bay ${slotCode}! Plug in to begin charging.`, "success", 3000);
    closeModal();
  });
  document.getElementById('modal-reel-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-reel-overlay') closeModal();
  });
}
