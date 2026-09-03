/**
 * SmartPark Hydrostatic Buoyancy Relief Valve Modal Component
 * Monitors sub-slab groundwater uplift pressure (14.2 kPa vs 40.0 kPa allowable) preventing basement heaving.
 */

import { showToast } from './toast.js';

export function openBuoyancyValveModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-brv-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🌊 Foundation Hydrodynamics
            </span>
            <h3 class="modal-title">Sub-Slab Buoyancy Relief Valve</h3>
          </div>
          <button type="button" class="modal-close" id="modal-brv-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Hydrostatic Pressure Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">MEASURED SLAB UPLIFT PRESSURE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">14.2 kPa Uplift</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Zero Uplift Distortion (Safety Limit &lt; 40.0 kPa - 64% Margin)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Water Table Depth: <strong style="color: var(--text-primary);">-4.50m Below Raft</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Poppet State: <strong style="color: var(--status-high-text);">Balanced Closed</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-brv" style="width: 100%;">
            Close Buoyancy Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-brv-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-brv').addEventListener('click', closeModal);
  document.getElementById('modal-brv-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-brv-overlay') closeModal();
  });
}
