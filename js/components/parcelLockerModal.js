/**
 * SmartPark Smart Parcel Locker Bay Modal Component
 * Enables motorists to retrieve deliveries in the parking facility lobby via OTP codes.
 */

import { showToast } from './toast.js';

export function openParcelLockerModal() {
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
    <div class="modal-overlay active" id="modal-lkr-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">📦 Smart Amenity</span>
            <h3 class="modal-title">Garage Parcel Locker Pickup</h3>
          </div>
          <button type="button" class="modal-close" id="modal-lkr-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Parcel Ready Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">📦🔓</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Package Ready in Locker BOX-B1-08
            </span>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 8px 0 4px;">
              FedEx Express (Trk: #748920194812)
            </h4>
            <span style="font-size: 0.8125rem; color: var(--text-secondary);">
              Located at Floor B1 Elevator Lobby Locker Tower.
            </span>
          </div>

          <form id="form-unlock-locker">
            <div class="input-group" style="margin-bottom: 18px;">
              <label class="input-label" for="locker-pin-input">6-Digit Pickup OTP PIN</label>
              <input type="text" id="locker-pin-input" class="input-control" value="482910" maxlength="6" style="font-family: monospace; font-size: 1.25rem; letter-spacing: 4px; text-align: center;" required />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
              🔓 Pop Open Locker Door BOX-B1-08 →
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-lkr-close').addEventListener('click', closeModal);
  document.getElementById('modal-lkr-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-lkr-overlay') closeModal();
  });

  document.getElementById('form-unlock-locker').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Locker door BOX-B1-08 popped open! Please retrieve your parcel and push door closed.", "success", 3500);
    closeModal();
  });
}
