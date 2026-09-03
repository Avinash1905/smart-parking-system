/**
 * SmartPark Motorized Fire Smoke Curtain & Compartmentalization Component
 * Real-time monitoring of ceiling-drop fiberglass fire containment barriers in underground levels.
 */

import { showToast } from './toast.js';

export function openFireCurtainModal(zoneName = "Municipal Central Parking") {
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

  const curtains = [
    { code: "FC-B1-NORTH-01", loc: "Floor B1 North Aisle", pos: "0% (Ceiling Stowed)", rating: "2 Hours (1000°C)", status: "ARMED" },
    { code: "FC-B2-SOUTH-02", loc: "Floor B2 South Ramp", pos: "0% (Ceiling Stowed)", rating: "2 Hours (1000°C)", status: "ARMED" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-curtain-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🛡️ Fire Compartmentalization
            </span>
            <h3 class="modal-title">Motorized Smoke Barrier Curtains</h3>
          </div>
          <button type="button" class="modal-close" id="modal-curtain-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Automated drop-down woven fiberglass curtains prevent smoke spread across underground floors in emergencies.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${curtains.map(c => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${c.loc}</strong>
                  <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">● ${c.status}</span>
                </div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary);">
                  Code: <strong>${c.code}</strong> • Position: ${c.pos} • Rating: ${c.rating}
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-test-curtain-drop" style="width: 100%;">
            ⚡ Run 10-Second Maintenance Drop & Retract Cycle
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-curtain-close').addEventListener('click', closeModal);
  document.getElementById('btn-test-curtain-drop').addEventListener('click', () => {
    showToast("Smoke curtain test cycle completed! Motorized winch and limit switches nominal.", "success", 2500);
  });
  document.getElementById('modal-curtain-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-curtain-overlay') closeModal();
  });
}
