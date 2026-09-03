/**
 * SmartPark NETC FASTag Auto-Debit Modal Component
 * Displays vehicle windshield FASTag link status and enables contactless toll drive-through.
 */

import { showToast } from './toast.js';

export function openFASTagPassModal(plate = "KA-01-MJ-5890") {
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
    <div class="modal-overlay active" id="modal-fastag-overlay">
      <div class="modal-content" style="max-width: 560px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🏷️ NETC Electronic Toll
            </span>
            <h3 class="modal-title">FASTag Auto-Debit Drive-Through</h3>
          </div>
          <button type="button" class="modal-close" id="modal-fastag-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- FASTag Pass Sticker Visual -->
          <div style="background: linear-gradient(135deg, #047857 0%, #10b981 100%); border: 2px solid rgba(255,255,255,0.2); border-radius: var(--radius-xl); padding: 22px; color: #ffffff; box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3); margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
              <div>
                <span style="font-size: 0.72rem; letter-spacing: 0.12em; color: rgba(255,255,255,0.8); font-weight: 800;">NETC FASTAG PARKING</span>
                <h4 style="font-size: 1.15rem; font-weight: 800; margin-top: 2px;">ICICI Bank FASTag Linked</h4>
              </div>
              <div style="font-size: 1.8rem;">🏷️</div>
            </div>

            <div style="margin-bottom: 16px;">
              <span style="font-size: 0.72rem; color: rgba(255,255,255,0.7); font-weight: 700;">FASTAG WALLET BALANCE</span>
              <div style="font-size: 1.8rem; font-weight: 900; color: #ffffff;">₹850.00</div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; font-family: monospace; color: rgba(255,255,255,0.9);">
              <span>PLATE: ${plate}</span>
              <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; font-weight: 800;">● AUTO-DEBIT ON</span>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-simulate-fastag-drive" style="width: 100%; justify-content: center; background: #10b981;">
            🚗 Drive Through Barrier (Auto-Debit ₹40)
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-fastag-close').addEventListener('click', closeModal);
  document.getElementById('modal-fastag-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-fastag-overlay') closeModal();
  });

  document.getElementById('btn-simulate-fastag-drive').addEventListener('click', () => {
    showToast("FASTag RFID tag scanned at 25 km/h! ₹40.00 debited from ICICI Bank wallet. Boom gate opened.", "success", 3000);
    closeModal();
  });
}
