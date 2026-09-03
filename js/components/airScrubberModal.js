/**
 * SmartPark Air Bio-Scrubber & Particulate Filtration Modal Component
 * Monitors electrostatic precipitators and HEPA air scrubbers eliminating vehicle exhaust soot.
 */

import { showToast } from './toast.js';

export function openAirScrubberModal(zoneName = "Municipal Central Parking") {
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

  const scrubbers = [
    { code: "SCRUB-B1-01", loc: "Floor B1 Center Aisle", in: "68.4 µg/m³", out: "8.2 µg/m³", eff: "88.0% Clean", status: "ACTIVE" },
    { code: "SCRUB-B2-02", loc: "Floor B2 Ramp Exhaust", in: "84.1 µg/m³", out: "6.4 µg/m³", eff: "92.4% Clean", status: "ACTIVE" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-scrub-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🌱 Pure Breathable Air
            </span>
            <h3 class="modal-title">PM2.5 Bio-Scrubber Filtration</h3>
          </div>
          <button type="button" class="modal-close" id="modal-scrub-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Commercial multi-stage HEPA scrubbers filter brake dust particles and exhaust particulates out of enclosed underground air.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${scrubbers.map(s => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${s.loc}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                    Inflow: ${s.in} → Purified: <strong style="color: var(--status-high-text);">${s.out}</strong>
                  </div>
                </div>

                <div style="text-align: right;">
                  <strong style="color: var(--status-high-text); font-size: 0.95rem; display: block;">${s.eff}</strong>
                  <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text); font-size: 0.7rem; margin-top: 2px;">
                    ● ${s.status}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-scrub" style="width: 100%;">
            Close Air Scrubber Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-scrub-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-scrub').addEventListener('click', closeModal);
  document.getElementById('modal-scrub-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-scrub-overlay') closeModal();
  });
}
