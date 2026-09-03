/**
 * SmartPark EV Battery Swapping Station (BSS) Modal Component
 * Enables electric 2W/3W couriers to perform 90-second battery swaps with zero recharge downtime.
 */

import { showToast } from './toast.js';

export function openBatterySwapModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-bss-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              ⚡ 90-Second Quick Swap
            </span>
            <h3 class="modal-title">EV Battery Swapping Cabinet</h3>
          </div>
          <button type="button" class="modal-close" id="modal-bss-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Battery Cabinet Status Grid -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🔋</div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">Cabinet BSS-CAB-01 Ready</h4>
            <div style="display: flex; justify-content: space-around; margin-top: 14px; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-lg);">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">100% CHARGED PACKS</span>
                <div style="font-size: 1.3rem; font-weight: 800; color: var(--status-high-text);">9 Batteries</div>
              </div>
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">SWAP TARIFF</span>
                <div style="font-size: 1.3rem; font-weight: 800; color: var(--primary-600);">₹85.00 Flat</div>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-unlock-battery-door" style="width: 100%; justify-content: center;">
            ⚡ Unlock Charged Battery Door #3
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-bss-close').addEventListener('click', closeModal);
  document.getElementById('btn-unlock-battery-door').addEventListener('click', () => {
    showToast("Door #3 popped open! Insert discharged battery and retrieve fresh 100% LFP pack.", "success", 3000);
    closeModal();
  });
  document.getElementById('modal-bss-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-bss-overlay') closeModal();
  });
}
