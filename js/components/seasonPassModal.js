/**
 * SmartPark Monthly Season Pass & Subscription Modal Component
 * Enables recurring unlimited parking subscriptions across all metropolitan facilities.
 */

import { showToast } from './toast.js';

export function openSeasonPassModal() {
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

  const plans = [
    { id: "plan-cbd", name: "CBD All-Deck Unlimited Pass", price: 2499, desc: "Unlimited 24/7 entry across all 12 Central Business District facilities." },
    { id: "plan-single", name: "Single Facility Dedicated Pass", price: 1499, desc: "Reserved guaranteed bay at your preferred workplace parking deck." }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-spass-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              ⭐ Unlimited Pass
            </span>
            <h3 class="modal-title">Monthly Parking Subscriptions</h3>
          </div>
          <button type="button" class="modal-close" id="modal-spass-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Save up to 45% compared to daily pay-as-you-go rates with unlimited automated ANPR barrier access.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${plans.map(p => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.95rem; display: block; margin-bottom: 2px;">${p.name}</strong>
                  <span style="font-size: 0.78rem; color: var(--text-secondary);">${p.desc}</span>
                  <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary-600); margin-top: 6px;">₹${p.price} / Month</div>
                </div>

                <button type="button" class="btn btn-primary btn-sm btn-sub-plan" data-name="${p.name}">
                  Subscribe →
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-spass-close').addEventListener('click', closeModal);
  document.getElementById('modal-spass-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-spass-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-sub-plan').forEach(btn => {
    btn.addEventListener('click', () => {
      const n = btn.getAttribute('data-name');
      showToast(`Subscribed to ${n}! Digital ANPR pass active immediately.`, "success", 3000);
      closeModal();
    });
  });
}
