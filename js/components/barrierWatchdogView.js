/**
 * SmartPark Barrier Solenoid Watchdog & Gate Health Monitor Component
 * Real-time telemetry on boom barrier motor temperatures, open cycle counts, and automated resets.
 */

import { showToast } from './toast.js';

export function openBarrierWatchdogModal() {
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

  const gates = [
    { code: "GATE-NORTH-BARRIER-01", cycles: "14,820", temp: "38.4°C", time: "140 ms", status: "HEALTHY" },
    { code: "GATE-SOUTH-BARRIER-02", cycles: "9,210", temp: "36.1°C", time: "135 ms", status: "HEALTHY" },
    { code: "GATE-PVT-TCS-ALPHA", cycles: "21,400", temp: "41.2°C", time: "155 ms", status: "HEALTHY" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-barrier-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🛡️ Barrier Watchdog
            </span>
            <h3 class="modal-title">Boom Barrier Hardware Health</h3>
          </div>
          <button type="button" class="modal-close" id="modal-barrier-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Continuous telemetry streaming from motorized boom barrier solenoids, optical safety loops, and microcontroller watchdogs.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${gates.map(g => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <strong style="font-family: monospace; color: var(--primary-600); font-size: 0.95rem;">${g.code}</strong>
                  <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">● ${g.status}</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 0.8125rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 8px;">
                  <div>Lifetime Cycles: <strong style="color: var(--text-primary);">${g.cycles}</strong></div>
                  <div>Motor Temp: <strong style="color: var(--status-high-text);">${g.temp}</strong></div>
                  <div>Lift Speed: <strong style="color: var(--text-primary);">${g.time}</strong></div>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-self-healing-reboot" style="width: 100%;">
            ⚡ Send Automated Firmware Self-Healing Ping
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-barrier-close').addEventListener('click', closeModal);
  document.getElementById('btn-self-healing-reboot').addEventListener('click', () => {
    showToast("Watchdog self-healing handshake acknowledged across all boom gates!", "success", 2500);
  });
  document.getElementById('modal-barrier-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-barrier-overlay') closeModal();
  });
}
