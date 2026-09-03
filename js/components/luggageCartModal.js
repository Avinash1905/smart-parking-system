/**
 * SmartPark Driver Luggage Cart Dispenser Modal Component
 * Enables motorists to unlock shopping & luggage carts in parking vestibules via mobile app.
 */

import { showToast } from './toast.js';

export function openLuggageCartModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-lcb-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🛒 Driver Convenience
            </span>
            <h3 class="modal-title">Luggage & Shopping Cart Bay</h3>
          </div>
          <button type="button" class="modal-close" id="modal-lcb-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Cart Bay Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🛒🛍️📦</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">AVAILABLE CARTS AT CORRAL</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">14 Carts Ready</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Free Mobile App Unlock (Earn ₹10 Credit on Return)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--text-primary);">Floor B1 Vestibule</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Deposit: <strong style="color: var(--status-high-text);">Zero Fee / RFID Tagged</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-unlock-cart-dock" style="width: 100%; justify-content: center;">
            🛒 Pop Solenoid Lock & Release Cart CART-RFID-904 →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-lcb-close').addEventListener('click', closeModal);
  document.getElementById('btn-unlock-cart-dock').addEventListener('click', () => {
    showToast("Dock solenoid released! Pull cart CART-RFID-904 from bay. Return to any corral to earn points.", "success", 3500);
    closeModal();
  });
  document.getElementById('modal-lcb-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-lcb-overlay') closeModal();
  });
}
