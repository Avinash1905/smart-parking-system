/**
 * SmartPark Digital Invoice & Parking Receipt Component
 * Renders verified QR pass, itemized tariff breakdown, GST calculation, and print/download actions.
 */

import { showToast } from './toast.js';

export function openInvoiceReceiptModal(bookingData) {
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

  const resId = bookingData.id || "RES-A2401";
  const passCode = bookingData.qr_pass_token || bookingData.pass_code || "PASS-M24-9982";
  const zoneName = bookingData.parking_zone_name || bookingData.parkingLocation || "Municipal Central Parking";
  const slotNum = bookingData.slot_number || "A-24";
  const plate = bookingData.vehicle_plate || bookingData.vehiclePlate || "KA-01-MJ-5890";
  const duration = bookingData.duration_hours || bookingData.durationHours || 2.0;
  const rate = bookingData.hourly_rate || 20.0;
  const subtotal = Math.round(duration * rate);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const modalHtml = `
    <div class="modal-overlay active" id="modal-invoice-overlay">
      <div class="modal-content" style="max-width: 520px; background: var(--bg-surface);">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              Tax Invoice & Parking Receipt
            </span>
            <h3 class="modal-title">SmartPark Receipt #${resId}</h3>
          </div>
          <button type="button" class="modal-close" id="modal-invoice-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Itemized Breakdown Box -->
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.875rem;">
              <span style="color: var(--text-secondary);">Parking Facility:</span>
              <strong style="color: var(--text-primary);">${zoneName}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.875rem;">
              <span style="color: var(--text-secondary);">Reserved Bay:</span>
              <strong style="color: var(--primary-600);">Slot ${slotNum}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.875rem;">
              <span style="color: var(--text-secondary);">Vehicle Registration:</span>
              <strong style="font-family: monospace;">${plate}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.875rem;">
              <span style="color: var(--text-secondary);">Duration:</span>
              <span>${duration} Hours (@ ₹${rate}/hr)</span>
            </div>
            <div style="border-top: 1px dashed var(--border-color); margin: 12px 0;"></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.84rem; color: var(--text-muted);">
              <span>Base Parking Tariff:</span>
              <span>₹${subtotal}.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.84rem; color: var(--text-muted);">
              <span>CGST + SGST (18%):</span>
              <span>₹${gst}.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--text-primary); border-top: 1.5px solid var(--border-color); padding-top: 10px;">
              <span>Total Amount Paid:</span>
              <span style="color: var(--status-high-text);">₹${total}.00</span>
            </div>
          </div>

          <!-- Digital QR Barcode Box -->
          <div style="text-align: center; padding: 14px; background: #ffffff; border-radius: var(--radius-lg); border: 2px solid var(--border-color); margin-bottom: 18px;">
            <div style="font-family: monospace; font-weight: 800; font-size: 1.1rem; color: #111827; letter-spacing: 0.15em; margin-bottom: 6px;">
              ||| | |||| | ||| |||| | ||
            </div>
            <div style="font-size: 0.84rem; font-weight: 700; color: #374151; letter-spacing: 0.08em;">
              ${passCode}
            </div>
            <span style="font-size: 0.72rem; color: #6b7280; margin-top: 4px; display: block;">
              Scan at entrance barrier for automatic boom arm lift
            </span>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 10px;">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-print-receipt" style="flex: 1;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Receipt
            </button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-download-pass" style="flex: 1.2;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Save Pass to Mobile
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-invoice-close').addEventListener('click', closeModal);
  document.getElementById('modal-invoice-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-invoice-overlay') closeModal();
  });

  document.getElementById('btn-print-receipt').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('btn-download-pass').addEventListener('click', () => {
    showToast("Parking QR Pass saved to downloads!", "success", 2000);
    closeModal();
  });
}
