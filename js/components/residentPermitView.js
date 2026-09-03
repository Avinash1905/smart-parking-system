/**
 * SmartPark Residential Street Permit & Visitor Passes Component
 * Enables residents to apply for annual parking decals and generate temporary guest passes.
 */

import { showToast } from './toast.js';

export function openResidentPermitModal() {
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
    <div class="modal-overlay active" id="modal-permit-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Municipal Civic Portal</span>
            <h3 class="modal-title">Residential Street Parking Permit</h3>
          </div>
          <button type="button" class="modal-close" id="modal-permit-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Active Permit Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">
                  ● ACTIVE PERMIT
                </span>
                <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  Jayanagar 4th Block Zone
                </h4>
              </div>
              <strong style="font-family: monospace; font-size: 1.1rem; color: var(--primary-600);">RES-BLR-9042</strong>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 10px;">
              <div>Vehicle: <strong style="color: var(--text-primary);">KA-05-AB-1234</strong></div>
              <div>Valid Until: <strong style="color: var(--text-primary);">31 Aug 2027</strong></div>
            </div>
          </div>

          <!-- Guest Pass Generator -->
          <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 16px;">
            <strong style="font-size: 0.95rem; color: var(--text-primary); display: block; margin-bottom: 4px;">Issue 24-Hour Guest Visitor Pass</strong>
            <p style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 12px;">Generate a temporary digital exemption pass for home guests or delivery contractors.</p>
            
            <div style="display: flex; gap: 8px;">
              <input type="text" id="guest-plate-input" class="input-control" placeholder="Guest Plate (e.g. KA-01-XX-0000)" style="flex: 1;" />
              <button type="button" class="btn btn-secondary btn-sm" id="btn-issue-guest-pass">
                Issue Guest Pass
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-permit-close').addEventListener('click', closeModal);
  document.getElementById('modal-permit-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-permit-overlay') closeModal();
  });

  document.getElementById('btn-issue-guest-pass').addEventListener('click', () => {
    const val = document.getElementById('guest-plate-input').value.trim();
    if (!val) {
      showToast("Please enter guest vehicle license plate.", "error", 2000);
      return;
    }
    showToast(`Guest Visitor pass issued for ${val.toUpperCase()}! Valid for 24 hours.`, "success", 3000);
    closeModal();
  });
}
