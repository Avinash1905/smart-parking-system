/**
 * SmartPark Ultrasonic Pest Deterrent Transducer Matrix Component
 * Monitors non-toxic, inaudible swept ultrasound (22-65 kHz) protecting vehicle wiring harnesses.
 */

import { showToast } from './toast.js';

export function openPestDeterrentModal(zoneName = "Municipal Central Parking") {
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
    { code: "PEST-US-B1-01", loc: "Floor B1 Cable Trays", sweep: "22-65 kHz Swept", pressure: "110 dB SPL", status: "ACTIVE PULSE" },
    { code: "PEST-US-B2-02", loc: "Floor B2 Distribution Inverter", sweep: "22-65 kHz Swept", pressure: "110 dB SPL", status: "ACTIVE PULSE" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-pest-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🛡️ Vehicle Asset Protection
            </span>
            <h3 class="modal-title">Ultrasonic Rodent Deterrent Grid</h3>
          </div>
          <button type="button" class="modal-close" id="modal-pest-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Swept high-frequency acoustic transducers prevent engine bay rat wiring damage without any harmful poisons or chemicals.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${nodes.map(n => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${n.loc}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); font-family: monospace;">${n.code} • ${n.sweep}</div>
                </div>
                <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
                  ● ${n.status}
                </span>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-pest" style="width: 100%;">
            Close Deterrent Controller
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-pest-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-pest').addEventListener('click', closeModal);
  document.getElementById('modal-pest-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-pest-overlay') closeModal();
  });
}
