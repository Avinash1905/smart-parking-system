/**
 * Parking History & Detailed Invoices Modal
 * Allows searching, filtering past parking sessions, and launching digital tax receipts.
 */

import { RECENT_PARKING_HISTORY } from '../data/dashboardData.js';
import { openInvoiceReceiptModal } from './invoiceReceiptModal.js';
import { showToast } from './toast.js';

export function openParkingHistoryModal() {
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
    <div class="modal-overlay active" id="modal-hist-overlay">
      <div class="modal-content" style="max-width: 740px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Session Ledger</span>
            <h3 class="modal-title">All Parking Sessions & Invoices</h3>
          </div>
          <button type="button" class="modal-close" id="modal-hist-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 16px 20px;">
          <!-- Filter Tabs -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; gap: 8px;">
              <button class="filter-chip active" id="filter-all-hist">All Sessions (${RECENT_PARKING_HISTORY.length})</button>
              <button class="filter-chip" id="filter-active-hist">Active (1)</button>
              <button class="filter-chip" id="filter-completed-hist">Completed (${RECENT_PARKING_HISTORY.length - 1})</button>
            </div>
            <span style="font-size: 0.8125rem; color: var(--text-muted);">Showing last 30 days history</span>
          </div>

          <!-- History Table -->
          <div style="overflow-x: auto; max-height: 380px;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Parking Location</th>
                  <th>Date & Time</th>
                  <th>Vehicle</th>
                  <th>Duration</th>
                  <th>Total Billed</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody id="hist-modal-table-body">
                ${RECENT_PARKING_HISTORY.map(item => `
                  <tr>
                    <td><strong>${item.locationName}</strong></td>
                    <td><span style="font-size: 0.8125rem; color: var(--text-muted);">${item.dateTime}</span></td>
                    <td><span style="font-family: monospace; font-weight: 700; color: var(--primary-600);">${item.vehiclePlate}</span></td>
                    <td>${item.durationHours} hrs</td>
                    <td><strong>₹${item.totalAmount}</strong></td>
                    <td>
                      <button type="button" class="btn btn-secondary btn-sm btn-view-single-receipt" data-id="${item.id}">
                        View Receipt
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-hist-modal">Close</button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-hist-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-hist-modal').addEventListener('click', closeModal);
  document.getElementById('modal-hist-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-hist-overlay') closeModal();
  });

  // View Receipt Handler
  modalContainer.querySelectorAll('.btn-view-single-receipt').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = RECENT_PARKING_HISTORY.find(h => h.id === id) || RECENT_PARKING_HISTORY[0];
      openInvoiceReceiptModal(item);
    });
  });
}
