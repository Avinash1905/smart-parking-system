/**
 * SmartPark Digital NFC Smart Pass & Contactless Wallet Modal Component
 * Displays digital RFID card, pre-paid balance, and contactless barrier tap simulation.
 */

import { showToast } from './toast.js';

export function openNFCPassModal() {
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
    <div class="modal-overlay active" id="modal-nfc-overlay">
      <div class="modal-content" style="max-width: 560px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Contactless Wallet</span>
            <h3 class="modal-title">SmartPark Titanium NFC Pass</h3>
          </div>
          <button type="button" class="modal-close" id="modal-nfc-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Premium Titanium NFC Pass Card Visual -->
          <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); border: 1.5px solid rgba(255,255,255,0.2); border-radius: var(--radius-xl); padding: 24px; color: #ffffff; box-shadow: 0 15px 30px rgba(49, 46, 129, 0.4); margin-bottom: 20px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
              <div>
                <span style="font-size: 0.72rem; letter-spacing: 0.12em; color: rgba(255,255,255,0.7); font-weight: 700;">SMARTPARK PLATINUM MOBILITY</span>
                <h4 style="font-size: 1.2rem; font-weight: 800; margin-top: 2px;">Contactless NFC Tap Pass</h4>
              </div>
              <div style="font-size: 2rem;">💳</div>
            </div>

            <div style="margin-bottom: 20px;">
              <span style="font-size: 0.72rem; color: rgba(255,255,255,0.6); font-weight: 700;">PRE-PAID BALANCE</span>
              <div style="font-size: 2rem; font-weight: 900; color: #38bdf8;">₹1,250.00</div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.8125rem; font-family: monospace; color: rgba(255,255,255,0.8);">
              <span>UID: 04-A1-B2-C3-D4</span>
              <span style="background: rgba(16,185,129,0.3); color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: 700;">● AUTO-RELOAD ON</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-topup-wallet" style="justify-content: center;">
              + Add ₹500 Funds
            </button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-simulate-nfc-tap" style="justify-content: center;">
              📲 Simulate Barrier Tap
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-nfc-close').addEventListener('click', closeModal);
  document.getElementById('modal-nfc-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-nfc-overlay') closeModal();
  });

  document.getElementById('btn-topup-wallet').addEventListener('click', () => {
    showToast("₹500 added to NFC Smart Pass! New balance: ₹1,750.00", "success", 2500);
  });

  document.getElementById('btn-simulate-nfc-tap').addEventListener('click', () => {
    showToast("NFC Card tapped! ₹40.00 deducted & gate barrier lifted.", "success", 2500);
    closeModal();
  });
}
