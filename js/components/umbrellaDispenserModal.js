/**
 * SmartPark Rain Umbrella Dispenser Modal Component
 * Enables pedestrians to borrow complimentary RFID umbrellas during rainy weather at exit gates.
 */

import { showToast } from './toast.js';

export function openUmbrellaDispenserModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-uds-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🌧️ Weather Hospitality
            </span>
            <h3 class="modal-title">Complimentary Rain Umbrella Pod</h3>
          </div>
          <button type="button" class="modal-close" id="modal-uds-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Umbrella Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🌧️☂️✨</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">AVAILABLE UMBRELLAS AT POD</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">32 Umbrellas Ready</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Rain Detected Outside (Free 24-Hour Loan - Return at Any SmartPark)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--text-primary);">Ground Floor Exit #1</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Loan Duration: <strong style="color: var(--primary-600);">24 Hours Free</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-dispense-umbrella" style="width: 100%; justify-content: center;">
            ☂️ Dispense Umbrella UMB-RFID-109 →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-uds-close').addEventListener('click', closeModal);
  document.getElementById('btn-dispense-umbrella').addEventListener('click', () => {
    showToast("Umbrella dispensed from slot 09! Stay dry and return to any SmartPark drop-box when done.", "success", 3500);
    closeModal();
  });
  document.getElementById('modal-uds-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-uds-overlay') closeModal();
  });
}
