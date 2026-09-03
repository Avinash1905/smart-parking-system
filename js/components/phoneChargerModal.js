/**
 * SmartPark Driver Lounge Wireless Phone Charger Modal Component
 * Enables motorists to charge smartphones inside secure 15W Qi wireless fast-charging lockers.
 */

import { showToast } from './toast.js';

export function openPhoneChargerModal() {
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
    <div class="modal-overlay active" id="modal-pcl-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              📱 Lounge Amenity
            </span>
            <h3 class="modal-title">Qi Wireless Phone Charger Locker</h3>
          </div>
          <button type="button" class="modal-close" id="modal-pcl-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Charger Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">📱⚡🔒</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">LOCKER PHONE-LOCKER-03</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">82% Charged (15W Qi)</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Fast Wireless Induction Active (Door Solenoid Locked)
            </span>
          </div>

          <form id="form-unlock-phone-locker">
            <div class="input-group" style="margin-bottom: 18px;">
              <label class="input-label" for="phone-pin-input">4-Digit Security PIN</label>
              <input type="password" id="phone-pin-input" class="input-control" value="9182" maxlength="4" style="font-family: monospace; font-size: 1.25rem; letter-spacing: 6px; text-align: center;" required />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
              🔓 Unlock Phone Locker Door →
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-pcl-close').addEventListener('click', closeModal);
  document.getElementById('modal-pcl-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-pcl-overlay') closeModal();
  });

  document.getElementById('form-unlock-phone-locker').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Phone locker door unlocked! Please retrieve your smartphone.", "success", 3000);
    closeModal();
  });
}
