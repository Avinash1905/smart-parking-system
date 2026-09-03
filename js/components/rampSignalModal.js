/**
 * SmartPark Helical Ramp Traffic Signal & Directional Flow Component
 * Displays alternating one-way traffic light phases on underground ramps to prevent vehicular standoffs.
 */

import { showToast } from './toast.js';

export function openRampSignalModal(zoneName = "Municipal Central Parking") {
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

  const ramps = [
    { code: "RAMP-G-TO-B1", desc: "Ground to Basement B1 Ramp", phase: "🟢 DOWNWARD PROCEED", time: "18s remaining", color: "var(--status-high-text)" },
    { code: "RAMP-B1-TO-B2", desc: "Basement B1 to B2 Ramp", phase: "🟢 UPWARD PROCEED", time: "12s remaining", color: "var(--status-high-text)" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-ramp-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🚦 Ramp Sequencing
            </span>
            <h3 class="modal-title">Helical Ramp Directional Signals</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ramp-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Intelligent inductive loop signal sequencing preventing head-on conflicts on single-lane spiral ramps.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${ramps.map(r => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${r.desc}</strong>
                  <span style="font-size: 0.84rem; font-weight: 800; color: ${r.color};">${r.phase}</span>
                </div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary); font-family: monospace;">
                  ${r.code} • Cycle: ${r.time}
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-ramp" style="width: 100%;">
            Close Ramp Controller
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ramp-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-ramp').addEventListener('click', closeModal);
  document.getElementById('modal-ramp-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ramp-overlay') closeModal();
  });
}
