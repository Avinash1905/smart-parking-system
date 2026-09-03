/**
 * SmartPark Contactless BLE Key Drop Safe Modal Component
 * Monitors motorized solenoid key vaults, BLE smartphone proximity unlocking, and valet key handoffs.
 */

import { showToast } from './toast.js';

export function openKeySafeModal(plate = "KA-01-EQ-9988") {
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
    <div class="modal-overlay active" id="modal-kss-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🔑 Valet Key Custody
            </span>
            <h3 class="modal-title">Contactless BLE Key Vault</h3>
          </div>
          <button type="button" class="modal-close" id="modal-kss-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Key Safe Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🔑🔒📱</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">VAULT DRAWER KEY-VAULT-B1-04</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">Key Secured (Locked)</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● BLE Smartphone Proximity Detected (-52 dBm RSSI)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Vehicle: <strong style="color: var(--text-primary);">${plate}</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Valet Operator: <strong style="color: var(--primary-600);">Badge #104 Active</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-release-key-drawer" style="width: 100%; justify-content: center;">
            🔓 Unlock Motorized Key Drawer via Bluetooth →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-kss-close').addEventListener('click', closeModal);
  document.getElementById('btn-release-key-drawer').addEventListener('click', () => {
    showToast("Key safe drawer popped open! Key fob retrieved safely.", "success", 3000);
    closeModal();
  });
  document.getElementById('modal-kss-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-kss-overlay') closeModal();
  });
}
