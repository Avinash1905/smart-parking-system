/**
 * SmartPark Corporate Visitor Pre-Clearance & Host Approval Modal Component
 * Enables enterprise employees to pre-register visiting clients and generate gate QR tokens.
 */

import { showToast } from './toast.js';

export function openVisitorPreclearanceModal() {
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
    <div class="modal-overlay active" id="modal-visitor-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-company badge-company-tcs" style="margin-bottom: 4px;">🏢 Campus Host Pass</span>
            <h3 class="modal-title">Pre-Clear Corporate Visitor</h3>
          </div>
          <button type="button" class="modal-close" id="modal-visitor-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <form id="form-visitor-preclear">
            <div class="input-group" style="margin-bottom: 12px;">
              <label class="input-label" for="vis-name-input">Visitor Full Name *</label>
              <input type="text" id="vis-name-input" class="input-control" placeholder="e.g. Rajesh Gupta" value="Rajesh Gupta" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div class="input-group">
                <label class="input-label" for="vis-email-input">Visitor Email *</label>
                <input type="email" id="vis-email-input" class="input-control" placeholder="rajesh.g@client.com" value="rajesh.g@client.com" required />
              </div>

              <div class="input-group">
                <label class="input-label" for="vis-plate-input">Vehicle Plate *</label>
                <input type="text" id="vis-plate-input" class="input-control" placeholder="KA-03-HA-8822" value="KA-03-HA-8822" required />
              </div>
            </div>

            <div class="input-group" style="margin-bottom: 18px;">
              <label class="input-label" for="vis-time-input">Visit Date & Arrival Window</label>
              <input type="text" id="vis-time-input" class="input-control" value="Tomorrow, 10:00 AM - 02:00 PM" required />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
              Issue Pre-Authorized Visitor Pass →
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-visitor-close').addEventListener('click', closeModal);
  document.getElementById('modal-visitor-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-visitor-overlay') closeModal();
  });

  document.getElementById('form-visitor-preclear').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Visitor Pre-Clearance pass issued! Digital QR gate pass emailed to guest.", "success", 3000);
    closeModal();
  });
}
