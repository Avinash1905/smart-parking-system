/**
 * SmartPark Indoor Air Quality & Jet Fan Automation Component
 * Visualizes underground carbon monoxide levels and automated ventilation states.
 */

import { showToast } from './toast.js';

export function openIAQMonitorModal(zoneName = "Municipal Central Parking") {
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

  const nodes = [
    { code: "IAQ-B1-01", floor: "BASEMENT 1 (B1)", co: "14.2 PPM", fan: "STANDBY (OFF)", aqi: "OPTIMAL (SAFE)", color: "var(--status-high-text)" },
    { code: "IAQ-B2-02", floor: "BASEMENT 2 (B2)", co: "28.6 PPM", fan: "HIGH-SPEED ACTIVE", aqi: "VENTILATION ACTIVE", color: "var(--status-med-text)" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-iaq-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🌬️ Atmospheric Safety
            </span>
            <h3 class="modal-title">Underground Air Quality (IAQ)</h3>
          </div>
          <button type="button" class="modal-close" id="modal-iaq-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Real-time carbon monoxide (CO) monitoring and automated jet fan induction dampers for underground parking levels.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${nodes.map(n => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${n.floor} (${n.code})</strong>
                  <span class="badge badge-public" style="color: ${n.color}; font-weight: 800;">● ${n.aqi}</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; border-top: 1px solid var(--border-color); padding-top: 8px;">
                  <div>CO Level: <strong style="color: var(--text-primary);">${n.co}</strong> (Threshold: 25 PPM)</div>
                  <div>Jet Fan: <strong style="color: var(--primary-600);">${n.fan}</strong></div>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-force-jet-fans" style="width: 100%;">
            ⚡ Force 100% Jet Fan Purge Cycle
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-iaq-close').addEventListener('click', closeModal);
  document.getElementById('modal-iaq-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-iaq-overlay') closeModal();
  });

  document.getElementById('btn-force-jet-fans').addEventListener('click', () => {
    showToast("Jet ventilation fans engaged at 100% speed! Emergency air exchange active.", "success", 2500);
  });
}
