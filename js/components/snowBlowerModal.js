/**
 * SmartPark Autonomous Rooftop Snow Blower Rover Modal Component
 * Monitors electric dual-stage snow blower rovers clearing open-air rooftop parking decks.
 */

import { showToast } from './toast.js';

export function openSnowBlowerModal(zoneName = "Municipal Central Parking") {
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

  const modalHtml = `
    <div class="modal-overlay active" id="modal-sbr-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              ❄️ Winter Fleet Operations
            </span>
            <h3 class="modal-title">Autonomous Rooftop Snow Blower</h3>
          </div>
          <button type="button" class="modal-close" id="modal-sbr-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Snow Blower Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🤖❄️</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">ROOFTOP DECK CLEARANCE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--accent-cyan); margin: 4px 0;">3,400 m² Cleared</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Docked Standby (96% Battery - Heated Chute Ready)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Snow Depth: <strong style="color: var(--text-primary);">14.5 cm Cleared</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Auger Impeller: <strong style="color: var(--primary-600);">1,850 RPM Dual Stage</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-trigger-snow-blast" style="width: 100%;">
            ⚡ Launch Immediate Automated Snow Clearing Run
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-sbr-close').addEventListener('click', closeModal);
  document.getElementById('btn-trigger-snow-blast').addEventListener('click', () => {
    showToast("Autonomous snow blower rover deployed! Dual-stage impeller engaged across rooftop lane 1.", "success", 2500);
  });
  document.getElementById('modal-sbr-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-sbr-overlay') closeModal();
  });
}
