/**
 * SmartPark Corporate Tenant Monthly Invoicing Modal Component
 * Displays consolidated parking usage statements and GST tax invoices for enterprise tenants.
 */

import { showToast } from './toast.js';

export function openTenantBillingModal() {
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
    <div class="modal-overlay active" id="modal-tbill-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-company badge-company-tcs" style="margin-bottom: 4px;">🏢 Corporate Accounts</span>
            <h3 class="modal-title">Monthly Enterprise Billing</h3>
          </div>
          <button type="button" class="modal-close" id="modal-tbill-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Invoice Summary Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
                  ● PAID & SETTLED
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  Tata Consultancy Services (TCS)
                </h4>
              </div>
              <strong style="font-family: monospace; font-size: 1.1rem; color: var(--primary-600);">INV-TCS-2026-08</strong>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.84rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 10px;">
              <div>Employee Sessions: <strong>18,420 Entries</strong></div>
              <div>Billing Month: <strong>August 2026</strong></div>
              <div>GST Tax (18%): <strong>₹66,312.00</strong></div>
              <div>Total Settled: <strong style="color: var(--status-high-text);">₹4,34,712.00</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-download-gst-pdf" style="width: 100%;">
            📄 Download Itemized GST Tax Invoice (PDF)
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-tbill-close').addEventListener('click', closeModal);
  document.getElementById('btn-download-gst-pdf').addEventListener('click', () => {
    showToast("Generating official GST tax invoice PDF with SAC code 996729...", "info", 2000);
  });
  document.getElementById('modal-tbill-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-tbill-overlay') closeModal();
  });
}
