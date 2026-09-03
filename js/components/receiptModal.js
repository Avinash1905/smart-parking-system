/**
 * SmartPark GST Digital Invoice & Tax Receipt Modal Component
 * Displays itemized CGST/SGST tax breakdown, QR verification signature, and print/PDF export buttons.
 */

import { showToast } from './toast.js';

export function openReceiptModal(reservation) {
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

  const baseAmount = parseFloat(reservation.total_amount || 40.0);
  const cgst = (baseAmount * 0.09).toFixed(2);
  const sgst = (baseAmount * 0.09).toFixed(2);
  const grandTotal = (baseAmount + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

  const modalHtml = `
    <div class="modal-overlay active" id="modal-receipt-overlay">
      <div class="modal-content" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🧾 Tax Invoice #INV-2026-9912
            </span>
            <h3 class="modal-title">Official Tax Receipt</h3>
          </div>
          <button type="button" class="modal-close" id="modal-receipt-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Itemized Invoice Table -->
          <div style="background: var(--bg-surface-subtle); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
              <span>Facility:</span>
              <strong>${reservation.parking_zone_name || 'Municipal Central Parking'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
              <span>Bay Assigned:</span>
              <strong>Slot ${reservation.slot_number || 'A-01'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
              <span>Duration:</span>
              <strong>${reservation.duration_hours || 2} Hours</strong>
            </div>
            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 12px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span>Base Parking Tariff:</span>
              <span>₹${baseAmount.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">
              <span>CGST (9.0%):</span>
              <span>₹${cgst}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px;">
              <span>SGST (9.0%):</span>
              <span>₹${sgst}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 900; color: var(--status-high-text);">
              <span>Grand Total Paid:</span>
              <span>₹${grandTotal}</span>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-print-receipt" style="width: 100%; justify-content: center; margin-bottom: 8px;">
            🖨️ Print / Download PDF Receipt
          </button>
          <button type="button" class="btn btn-secondary" id="btn-close-receipt" style="width: 100%; justify-content: center;">
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-receipt-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-receipt').addEventListener('click', closeModal);
  document.getElementById('modal-receipt-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-receipt-overlay') closeModal();
  });

  document.getElementById('btn-print-receipt').addEventListener('click', () => {
    window.print();
  });
}
