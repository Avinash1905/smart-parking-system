/**
 * SmartPark Jet Fan Variable Frequency Drive (VFD) Inverter Matrix Component
 * Monitors underground garage ventilation fan RPM, motor drive frequencies, and aerodynamic thrust.
 */

import { showToast } from './toast.js';

export function openVFDFanMatrixModal(zoneName = "Municipal Central Parking") {
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

  const fans = [
    { code: "JET-FAN-B1-01", loc: "Floor B1 Center Aisle", speed: "720 RPM", freq: "30.0 Hz", thrust: "38.5 N", status: "MODULATING" },
    { code: "JET-FAN-B1-02", loc: "Floor B1 North Exhaust", speed: "720 RPM", freq: "30.0 Hz", thrust: "38.5 N", status: "MODULATING" },
    { code: "JET-FAN-B2-03", loc: "Floor B2 Deep Sump", speed: "650 RPM", freq: "28.0 Hz", thrust: "34.0 N", status: "MODULATING" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-vfd-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              💨 HVAC Jet Inverters
            </span>
            <h3 class="modal-title">Underground Jet Fan Matrix</h3>
          </div>
          <button type="button" class="modal-close" id="modal-vfd-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Dynamic variable frequency drives modulate fan blade RPM based on real-time CO parts-per-million air sensors.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${fans.map(f => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="font-family: monospace; color: var(--primary-600);">${f.code}</strong>
                  <div style="font-size: 0.8125rem; color: var(--text-primary); margin-top: 2px;">${f.loc}</div>
                  <span style="font-size: 0.75rem; color: var(--text-secondary);">Thrust: ${f.thrust} • VFD: ${f.freq}</span>
                </div>

                <div style="text-align: right;">
                  <strong style="color: var(--status-high-text); font-size: 0.95rem; display: block;">${f.speed}</strong>
                  <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text); font-size: 0.7rem; margin-top: 2px;">
                    ● ${f.status}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-vfd" style="width: 100%;">
            Close Jet Fan Controller
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-vfd-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-vfd').addEventListener('click', closeModal);
  document.getElementById('modal-vfd-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-vfd-overlay') closeModal();
  });
}
