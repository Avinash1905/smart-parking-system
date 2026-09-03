/**
 * SmartPark Wheel Boot Immobilization & Smart Unclamp Modal Component
 * Enables violators to pay outstanding citation penalties online and obtain instant wheel clamp unlock PINs.
 */

import { showToast } from './toast.js';

export function openWheelBootModal(plate = "KA-05-ZZ-9911") {
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
    <div class="modal-overlay active" id="modal-boot-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🔒 Enforcement Action
            </span>
            <h3 class="modal-title">Vehicle Immobilized (Wheel Clamp)</h3>
          </div>
          <button type="button" class="modal-close" id="modal-boot-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="background: rgba(239,68,68,0.08); border: 2px solid #ef4444; border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge" style="background: #ef4444; color: #ffffff; font-weight: 800;">
                  ● BOOT-CLAMP-08 LOCKED
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  Plate: ${plate}
                </h4>
              </div>
              <strong style="font-size: 1.3rem; color: #ef4444;">₹1,200 Fine</strong>
            </div>

            <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; border-top: 1px solid rgba(239,68,68,0.2); padding-top: 10px;">
              <div>Reason: <strong>Unpaid Habitual Overstay (> 48 Hours)</strong></div>
              <div>Facility: <strong>Municipal Central Parking (Floor B1)</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-pay-boot-fine" style="width: 100%; justify-content: center; background: #ef4444;">
            Pay Fine & Reveal Instant Unlock PIN (₹1,200) →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-boot-close').addEventListener('click', closeModal);
  document.getElementById('modal-boot-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-boot-overlay') closeModal();
  });

  document.getElementById('btn-pay-boot-fine').addEventListener('click', () => {
    showToast("Fine of ₹1,200 settled! Smart padlock release code: 7492. Clamp unlocked.", "success", 3500);
    closeModal();
  });
}
