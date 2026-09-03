/**
 * SmartPark Accessible (ADA / Wheelchair) Reserved Bay Component
 * Provides accessible parking reservations with step-free navigation to elevators.
 */

import { showToast } from './toast.js';

export function openADAParkingModal(zoneName = "Municipal Central Parking") {
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
    { code: "ADA-G-01", loc: "Floor G (10m from Main Elevator)", width: "3.8m Extra-Wide Van Bay", status: "AVAILABLE" },
    { code: "ADA-G-02", loc: "Floor G (14m from North Elevator)", width: "3.8m Extra-Wide Van Bay", status: "AVAILABLE" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-ada-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              ♿ Universal Accessibility
            </span>
            <h3 class="modal-title">Accessible (ADA) Parking Bays</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ada-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Extra-wide designated stalls with level zero-step tactile paving pathways directly connecting to building elevators.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${bays.map(b => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--primary-600); font-family: monospace; font-size: 1rem;">${b.code}</strong>
                  <div style="font-size: 0.84rem; color: var(--text-primary); font-weight: 700; margin-top: 2px;">${b.loc}</div>
                  <span style="font-size: 0.78rem; color: var(--text-secondary);">${b.width} • Tactile Paved</span>
                </div>

                <button type="button" class="btn btn-primary btn-sm btn-reserve-ada" data-code="${b.code}">
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

  document.getElementById('modal-ada-close').addEventListener('click', closeModal);
  document.getElementById('modal-ada-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ada-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-reserve-ada').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.getAttribute('data-code');
      showToast(`Accessible Bay ${c} reserved! Blue overhead LED illuminated for your arrival.`, "success", 3000);
      closeModal();
    });
  });
}
