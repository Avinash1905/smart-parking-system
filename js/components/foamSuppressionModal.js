/**
 * SmartPark High-Expansion Foam Fire Suppression Modal Component
 * Monitors 1:500 synthetic high-expansion foam generators and rapid oxygen suffocation deluge systems.
 */

import { showToast } from './toast.js';

export function openFoamSuppressionModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-foam-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🚒 Life Safety System
            </span>
            <h3 class="modal-title">High-Expansion Foam Fire Suppression</h3>
          </div>
          <button type="button" class="modal-close" id="modal-foam-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Foam Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚒🫧</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">SUPPRESSION GRID READINESS</span>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">Armed NFPA 11 Standby</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 1:500 High-Expansion (90s Full Room Flood Ready)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Concentrate Tank: <strong style="color: var(--text-primary);">2,500 L Ready</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Deluge Water: <strong style="color: var(--status-high-text);">8.5 Bar Pressure</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-foam" style="width: 100%;">
            Close Foam System Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-foam-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-foam').addEventListener('click', closeModal);
  document.getElementById('modal-foam-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-foam-overlay') closeModal();
  });
}
