/**
 * SmartPark Smart Grid Peak Shaving & V2G Energy Arbitrage Component
 * Displays real-time electric utility demand response events and EV battery discharge incentives.
 */

import { showToast } from './toast.js';

export function openGridArbitrageModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-grid-arb-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              ⚡ Grid Energy Arbitrage
            </span>
            <h3 class="modal-title">Smart Grid Peak Shaving & V2G</h3>
          </div>
          <button type="button" class="modal-close" id="modal-grid-arb-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Grid Peak Event Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
                  ● BESCOM UTILITY PROGRAM SETTLED
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  114.5 kW Peak Load Curtailed
                </h4>
              </div>
              <strong style="font-size: 1.3rem; color: var(--primary-600);">+₹3,450 Rebate</strong>
            </div>

            <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; border-top: 1px solid var(--border-color); padding-top: 10px;">
              <div>Utility Dispatch Partner: <strong>BESCOM (Bangalore Electricity Supply)</strong></div>
              <div>Vehicle-to-Grid (V2G): <strong style="color: var(--status-high-text);">8 Plugged-In EVs Buffered Grid Frequency</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-grid-arb" style="width: 100%;">
            Close Grid Arbitrage Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-grid-arb-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-grid-arb').addEventListener('click', closeModal);
  document.getElementById('modal-grid-arb-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-grid-arb-overlay') closeModal();
  });
}
