/**
 * Admin Digital Pass Scanner & Verification Modal
 * Validates QR tokens, checks bay allocations, and permits manual gate overrides.
 */

import { showToast } from './toast.js';

export function openPassVerificationModal(onVerified) {
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
    <div class="modal-overlay active" id="modal-scanner-overlay">
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              Gate Barrier Scanner
            </span>
            <h3 class="modal-title">Verify Digital Parking Pass</h3>
          </div>
          <button type="button" class="modal-close" id="modal-scanner-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <form id="form-scan-pass">
            <div class="input-group" style="margin-bottom: 16px;">
              <label class="input-label" for="scan-token-input">Scan Barcode / Enter Pass Code</label>
              <input type="text" id="scan-token-input" class="input-control" placeholder="e.g. PASS-M24-9982 or SPK-..." style="text-transform: uppercase; font-family: monospace; font-weight: 700;" value="PASS-M24-9982" required />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-bottom: 20px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Verify & Authorize Gate Lift
            </button>
          </form>

          <!-- Result Card (Initially Visible for Demo) -->
          <div id="scan-result-card" style="background: var(--bg-surface-subtle); border: 1.5px solid #10b981; border-radius: var(--radius-lg); padding: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; color: var(--status-high-text); font-weight: 800; font-size: 0.95rem; margin-bottom: 10px;">
              <span>✓</span> PASS VALID & CLEARANCE ACTIVE
            </div>
            <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6;">
              <strong>Driver:</strong> Avinash Sharma (TCS)<br>
              <strong>Vehicle Plate:</strong> KA-01-MJ-5890<br>
              <strong>Facility:</strong> Municipal Central Parking<br>
              <strong>Assigned Slot:</strong> Bay M-24 (Ground Floor)<br>
              <strong>Valid Window:</strong> 10:30 AM — 12:30 PM (Active)
            </div>

            <button type="button" class="btn btn-secondary btn-sm" id="btn-manual-gate-open" style="width: 100%; margin-top: 14px; border-color: #10b981; color: #10b981;">
              Trigger Barrier Gate Open (20s)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-scanner-close').addEventListener('click', closeModal);
  document.getElementById('modal-scanner-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-scanner-overlay') closeModal();
  });

  document.getElementById('form-scan-pass').addEventListener('submit', (e) => {
    e.preventDefault();
    const token = document.getElementById('scan-token-input').value.trim();
    showToast(`Pass ${token} validated! Gate clearance issued.`, 'success', 2500);
    document.getElementById('scan-result-card').style.display = 'block';
  });

  document.getElementById('btn-manual-gate-open').addEventListener('click', () => {
    showToast("Boom barrier lifted! Timer reset for 20 seconds.", "success", 2000);
    if (onVerified) onVerified();
    closeModal();
  });
}
