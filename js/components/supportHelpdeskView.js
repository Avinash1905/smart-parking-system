/**
 * SmartPark Driver Helpdesk & Incident Center Component
 * Provides emergency barrier assistance, ticket creation, and common FAQ accordions.
 */

import { showToast } from './toast.js';

export function openSupportHelpdeskModal() {
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
    <div class="modal-overlay active" id="modal-support-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Driver Assistance</span>
            <h3 class="modal-title">Help Center & Incident Support</h3>
          </div>
          <button type="button" class="modal-close" id="modal-support-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Emergency Intercom Callout -->
          <div style="background: rgba(239,68,68,0.08); border: 1.5px solid rgba(239,68,68,0.3); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong style="color: var(--status-low-text); font-size: 0.95rem; display: block;">Stuck at Gate Barrier?</strong>
              <span style="font-size: 0.8125rem; color: var(--text-secondary);">Direct intercom connection to parking facility security control.</span>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-emergency-intercom" style="border-color: #ef4444; color: #ef4444;">
              🚨 Emergency Intercom
            </button>
          </div>

          <!-- Ticket Creation Form -->
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">Submit Support Request</h4>
          <form id="form-support-ticket">
            <div class="input-group" style="margin-bottom: 12px;">
              <label class="input-label" for="ticket-cat-select">Category</label>
              <select id="ticket-cat-select" class="input-control">
                <option value="GATE_BARRIER_ISSUE">Gate Boom Barrier Failure</option>
                <option value="PAYMENT_DISPUTE">Payment / Tariff Dispute</option>
                <option value="WRONG_SLOT">Assigned Slot Occupied by Another Vehicle</option>
                <option value="EV_CHARGER_FAULT">EV Fast Charger Station Offline</option>
              </select>
            </div>

            <div class="input-group" style="margin-bottom: 12px;">
              <label class="input-label" for="ticket-subject-input">Subject</label>
              <input type="text" id="ticket-subject-input" class="input-control" placeholder="Brief summary of the issue..." required />
            </div>

            <div class="input-group" style="margin-bottom: 16px;">
              <label class="input-label" for="ticket-desc-input">Description / Facility Details</label>
              <textarea id="ticket-desc-input" class="input-control" rows="3" placeholder="Provide bay number or transaction reference..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
              Submit Support Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-support-close').addEventListener('click', closeModal);
  document.getElementById('modal-support-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-support-overlay') closeModal();
  });

  document.getElementById('btn-emergency-intercom').addEventListener('click', () => {
    showToast("Connecting to live security intercom... (Simulation: Gate cleared)", "info", 3000);
  });

  document.getElementById('form-support-ticket').addEventListener('submit', (e) => {
    e.preventDefault();
    const subj = document.getElementById('ticket-subject-input').value.trim();
    showToast(`Support Ticket created! Ref: TICK-${Date.now().toString(36).toUpperCase()}`, "success", 2500);
    closeModal();
  });
}
