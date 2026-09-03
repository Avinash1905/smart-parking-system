/**
 * SmartPark Hydraulic Flood Barrier Gate Modal Component
 * Monitors in-ground automatic hydraulic steel flood walls protecting underground decks from flash floods.
 */

import { showToast } from './toast.js';

export function openFloodGateModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-flg-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🌊 Flood Defense System
            </span>
            <h3 class="modal-title">Hydraulic Ramp Flood Barrier</h3>
          </div>
          <button type="button" class="modal-close" id="modal-flg-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Flood Gate Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🌊🛡️</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">STREET STORM WATER DEPTH</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--accent-cyan); margin: 4px 0;">8.5 cm Depth</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Flood Gate Armed Standby (Auto-Deploy Trigger: 25.0 cm)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Barrier Rating: <strong style="color: var(--text-primary);">1.20m Hydrostatic Head</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Hydraulic Ram: <strong style="color: var(--primary-600);">2,200 PSI Ready</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-deploy-flood-gate" style="width: 100%;">
            ⚡ Run 18-Second Hydraulic Seal Test
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-flg-close').addEventListener('click', closeModal);
  document.getElementById('btn-deploy-flood-gate').addEventListener('click', () => {
    showToast("Hydraulic rams engaged! 1.2m steel floodgate raised and perimeter compression seals verified.", "success", 2500);
  });
  document.getElementById('modal-flg-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-flg-overlay') closeModal();
  });
}
