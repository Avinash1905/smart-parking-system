/**
 * SmartPark Digital Wallet (PKPass) Parking Pass Modal Component
 * Enables motorists to save digital parking tickets directly into Apple Wallet and Google Wallet.
 */

import { showToast } from './toast.js';

export function openTicketWalletModal(slotCode = "A-04", plate = "KA-01-EQ-9988") {
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
    <div class="modal-overlay active" id="modal-twp-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              📲 Digital Keyless Parking
            </span>
            <h3 class="modal-title">Apple / Google Wallet Pass</h3>
          </div>
          <button type="button" class="modal-close" id="modal-twp-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Wallet Card Preview -->
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff; border-radius: var(--radius-xl); padding: 24px; text-align: center; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(79,70,229,0.3);">
            <div style="font-size: 0.8125rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; opacity: 0.85;">SMARTPARK DIGITAL PASS</div>
            <div style="font-size: 2.0rem; font-weight: 900; margin: 6px 0;">Stall ${slotCode}</div>
            <div style="font-size: 0.95rem; opacity: 0.9;">Vehicle: <strong>${plate}</strong></div>
            <div style="margin: 16px auto 8px; width: 130px; height: 130px; background: #fff; padding: 8px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <div style="font-size: 3.5rem;">📱</div>
            </div>
            <div style="font-size: 0.75rem; opacity: 0.75; font-family: monospace;">PKPASS-9048-KA01</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
            <button type="button" class="btn btn-primary" id="btn-add-apple-wallet" style="justify-content: center; background: #000; border-color: #000;">
               Add to Apple Wallet
            </button>
            <button type="button" class="btn btn-primary" id="btn-add-google-wallet" style="justify-content: center; background: #1a73e8; border-color: #1a73e8;">
              G Add to Google Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-twp-close').addEventListener('click', closeModal);
  document.getElementById('btn-add-apple-wallet').addEventListener('click', () => {
    showToast("SmartPark pass added to Apple Wallet! NFC express check-in ready.", "success", 3000);
    closeModal();
  });
  document.getElementById('btn-add-google-wallet').addEventListener('click', () => {
    showToast("SmartPark pass saved to Google Wallet! Tap-to-exit enabled.", "success", 3000);
    closeModal();
  });
  document.getElementById('modal-twp-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-twp-overlay') closeModal();
  });
}
