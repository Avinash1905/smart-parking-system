/**
 * SmartPark Ramp Radiant Heating & Anti-Ice Modal Component
 * Monitors embedded sub-slab hydronic heat cables preventing black ice on entrance ramps.
 */

import { showToast } from './toast.js';

export function openRampHeatingModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-rph-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(245,158,11,0.15); color: #f59e0b; margin-bottom: 4px;">
              ❄️ Winter Anti-Freeze Safety
            </span>
            <h3 class="modal-title">Helical Ramp Radiant Heating</h3>
          </div>
          <button type="button" class="modal-close" id="modal-rph-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Slab Temp Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">CONCRETE SLAB SURFACE TEMP</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">6.4°C Surface</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Frost Free (Auto-Heat Trigger Setpoint: &lt; 2.0°C)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Ambient Air: <strong style="color: var(--text-primary);">4.2°C</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Heating Cables: <strong style="color: var(--primary-600);">Standby Armed</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-rph" style="width: 100%;">
            Close Ramp Heating Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-rph-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-rph').addEventListener('click', closeModal);
  document.getElementById('modal-rph-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-rph-overlay') closeModal();
  });
}
