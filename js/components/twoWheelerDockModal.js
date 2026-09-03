/**
 * SmartPark Two-Wheeler & EV Scooter Stacking Dock Modal Component
 * Enables high-density 2-wheeler reservations at ₹5.00/hour with smart helmet lockers.
 */

import { showToast } from './toast.js';

export function openTwoWheelerDockModal(zoneName = "Municipal Central Parking") {
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

  const bays = [
    { bay: "2W-BAY-01", type: "⚡ EV Scooter Fast Bay", locker: "Smart Helmet Locker #401", rate: "₹5.00/hr", status: "AVAILABLE" },
    { bay: "2W-BAY-02", type: "🏍️ Standard Motorcycle Bay", locker: "Smart Helmet Locker #402", rate: "₹5.00/hr", status: "AVAILABLE" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-2w-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Two-Wheeler Mobility</span>
            <h3 class="modal-title">Motorcycle & Scooter Stacking Bays</h3>
          </div>
          <button type="button" class="modal-close" id="modal-2w-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Secure covered parking for motorcycles and electric scooters with integrated digital helmet lockers.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${bays.map(b => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                    <strong style="color: var(--primary-600); font-family: monospace;">${b.bay}</strong>
                    <strong style="font-size: 0.95rem; color: var(--text-primary);">${b.type}</strong>
                  </div>
                  <span style="font-size: 0.8125rem; color: var(--text-secondary);">${b.locker}</span>
                  <div style="font-size: 1.1rem; font-weight: 800; color: var(--status-high-text); margin-top: 4px;">${b.rate}</div>
                </div>

                <button type="button" class="btn btn-primary btn-sm btn-book-2w-bay" data-bay="${b.bay}">
                  Reserve Bay →
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-2w-close').addEventListener('click', closeModal);
  document.getElementById('modal-2w-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-2w-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-book-2w-bay').forEach(btn => {
    btn.addEventListener('click', () => {
      const b = btn.getAttribute('data-bay');
      showToast(`Two-Wheeler Bay ${b} reserved! Helmet locker security PIN: 4892.`, "success", 3000);
      closeModal();
    });
  });
}
