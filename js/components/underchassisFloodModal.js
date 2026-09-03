/**
 * SmartPark Under-Chassis EV Battery Direct-Piercing Water Lance Modal Component
 * Monitors pneumatic piercing lances (300 LPM direct battery core cooling, 8.5 bar pneumatic actuator).
 */

import { showToast } from './toast.js';

export function openUnderchassisFloodModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-ufn-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(239,68,68,0.15); color: var(--status-critical); margin-bottom: 4px;">
              🔥 EV Core Fire Suppression
            </span>
            <h3 class="modal-title">Under-Chassis Direct Water Lance</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ufn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Underchassis Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚿🔋⚡</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">DIRECT CORE WATER INJECTION FLOW</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">300 LPM (8.5 Bar Air)</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Direct Casing Piercing Armed (99.4% Thermal Arrest Effectiveness)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--text-primary);">Floor B1 EV Fire Bay</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Readiness: <strong style="color: var(--status-high-text);">Pneumatic Armed</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-ufn" style="width: 100%;">
            Close Lance Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ufn-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-ufn').addEventListener('click', closeModal);
  document.getElementById('modal-ufn-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ufn-overlay') closeModal();
  });
}
