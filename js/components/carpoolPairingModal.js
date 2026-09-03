/**
 * SmartPark Corporate Carpool & HOV Preferential Bay Modal Component
 * Enables commuters to pair with verified campus colleagues for 50% parking fee discounts.
 */

import { showToast } from './toast.js';

export function openCarpoolPairingModal() {
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
    <div class="modal-overlay active" id="modal-cpool-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              👥 Corporate Carpool Hub
            </span>
            <h3 class="modal-title">HOV 50% Discount Pairing</h3>
          </div>
          <button type="button" class="modal-close" id="modal-cpool-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Carpool Match Banner -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
                  ● 3 PASSENGERS VERIFIED (HOV-3)
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  Electronic City Commute Pool
                </h4>
              </div>
              <strong style="font-family: monospace; font-size: 1.1rem; color: var(--primary-600);">HOV-BAY-01</strong>
            </div>

            <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; border-top: 1px solid var(--border-color); padding-top: 10px;">
              <div>Co-Riders: <strong>Neha V. (Infosys)</strong> & <strong>Suresh M. (TCS)</strong></div>
              <div>Preferential Stall: <strong>Floor G (Direct Elevator Access)</strong></div>
            </div>
          </div>

          <!-- 50% Discount Callout -->
          <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted);">CARPOOL GREEN INCENTIVE:</span>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--status-high-text);">50% Flat Tariff Discount Applied</div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-confirm-cpool-slot" style="width: 100%; justify-content: center;">
            Reserve HOV Prime Slot (₹5.00/hr) →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-cpool-close').addEventListener('click', closeModal);
  document.getElementById('modal-cpool-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-cpool-overlay') closeModal();
  });

  document.getElementById('btn-confirm-cpool-slot').addEventListener('click', () => {
    showToast("HOV Prime Slot reserved! Co-riders notified with digital entry passes.", "success", 3000);
    closeModal();
  });
}
