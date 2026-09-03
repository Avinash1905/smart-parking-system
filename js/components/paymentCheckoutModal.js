/**
 * SmartPark Payment Checkout & Tariff Settlement Modal
 * Enables UPI QR scanning, card checkout, corporate wallet settlement, and instant pass activation.
 */

import { showToast } from './toast.js';

export function openPaymentCheckoutModal(bookingData, onPaymentSuccess) {
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

  const amount = bookingData.totalAmount || bookingData.total_amount || 40.0;
  const zoneName = bookingData.parkingLocation || bookingData.parking_zone_name || "Municipal Central Parking";
  const slotNumber = bookingData.slotNumber || bookingData.slot_number || "A-24";

  const modalHtml = `
    <div class="modal-overlay active" id="modal-checkout-overlay">
      <div class="modal-content" style="max-width: 520px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              Secure Settlement Gateway
            </span>
            <h3 class="modal-title">Payment & Pass Confirmation</h3>
          </div>
          <button type="button" class="modal-close" id="modal-checkout-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Order Summary Card -->
          <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.875rem;">
              <span style="color: var(--text-secondary);">Facility & Slot:</span>
              <strong style="color: var(--text-primary);">${zoneName} (Bay ${slotNumber})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); border-top: 1px dashed var(--border-color); padding-top: 10px; margin-top: 10px;">
              <span>Total Payable:</span>
              <span style="color: var(--primary-600);">₹${amount}.00</span>
            </div>
          </div>

          <!-- Payment Methods Tabs -->
          <div style="margin-bottom: 20px;">
            <label class="input-label" style="margin-bottom: 10px;">Select Payment Method</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
              <button type="button" class="btn btn-secondary pay-method-btn active" data-method="UPI">
                📱 UPI / QR
              </button>
              <button type="button" class="btn btn-secondary pay-method-btn" data-method="CARD">
                💳 Card
              </button>
              <button type="button" class="btn btn-secondary pay-method-btn" data-method="WALLET">
                🏢 Fleet Wallet
              </button>
            </div>
          </div>

          <!-- UPI QR Box Container -->
          <div id="pay-upi-view" style="text-align: center; background: #ffffff; border: 2px solid var(--border-color); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 20px;">
            <div style="font-size: 0.8125rem; font-weight: 700; color: #4b5563; margin-bottom: 12px;">
              Scan UPI QR Code with GPay, PhonePe or Paytm
            </div>
            <!-- Dynamic Vector QR Mock -->
            <div style="width: 140px; height: 140px; margin: 0 auto 12px; background: #f3f4f6; border: 3px solid #111827; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2.2rem;">
              🏁
            </div>
            <span style="font-family: monospace; font-size: 0.84rem; font-weight: 700; color: #1f2937;">
              smartpark.pay@hdfcbank
            </span>
          </div>

          <button type="button" class="btn btn-primary" id="btn-confirm-pay-success" style="width: 100%; justify-content: center; font-size: 1rem; padding: 12px;">
            Simulate Instant Payment (₹${amount}.00) →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-checkout-close').addEventListener('click', closeModal);
  document.getElementById('modal-checkout-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-checkout-overlay') closeModal();
  });

  document.getElementById('btn-confirm-pay-success').addEventListener('click', () => {
    showToast("Payment verified! Digital QR Pass generated.", "success", 2500);
    if (onPaymentSuccess) onPaymentSuccess();
    closeModal();
  });
}
