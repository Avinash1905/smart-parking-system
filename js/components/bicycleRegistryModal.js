/**
 * SmartPark Bicycle Serial Registry & Anti-Theft Modal Component
 * Registers pedal cycles and e-bikes with engraved frame serials and RFID dock security tags.
 */

import { showToast } from './toast.js';

export function openBicycleRegistryModal() {
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
    <div class="modal-overlay active" id="modal-bike-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">🚲 Anti-Theft Protection</span>
            <h3 class="modal-title">Bicycle Frame Serial Registry</h3>
          </div>
          <button type="button" class="modal-close" id="modal-bike-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <form id="form-bike-register">
            <div class="input-group" style="margin-bottom: 12px;">
              <label class="input-label" for="bike-model-input">Bicycle Brand & Model *</label>
              <input type="text" id="bike-model-input" class="input-control" placeholder="e.g. Trek Marlin 7 Hardtail" value="Trek Marlin 7 Hardtail" required />
            </div>

            <div class="input-group" style="margin-bottom: 12px;">
              <label class="input-label" for="bike-sn-input">Frame Serial Number (Engraved on Bottom Bracket) *</label>
              <input type="text" id="bike-sn-input" class="input-control" placeholder="e.g. TREK-SN-8829104" value="TREK-SN-8829104" required />
            </div>

            <div class="input-group" style="margin-bottom: 18px;">
              <label class="input-label" for="bike-rfid-input">Digital RFID Parking Tag ID</label>
              <input type="text" id="bike-rfid-input" class="input-control" value="RFID-BIKE-4401" readonly style="font-family: monospace;" />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
              Register Bike & Activate Dock Alarm →
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-bike-close').addEventListener('click', closeModal);
  document.getElementById('modal-bike-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-bike-overlay') closeModal();
  });

  document.getElementById('form-bike-register').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Bicycle serial registered! Smart dock alarm armed with RFID-BIKE-4401 tag.", "success", 3000);
    closeModal();
  });
}
