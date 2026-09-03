/**
 * SmartPark Solar Canopy & Microgrid Clean Energy Hub Component
 * Visualizes live rooftop solar photovoltaic generation, battery storage state, and grid exports.
 */

import { showToast } from './toast.js';

export function openMicrogridModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-grid-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              ☀️ Renewable Solar Microgrid
            </span>
            <h3 class="modal-title">Rooftop Solar & Battery Storage</h3>
          </div>
          <button type="button" class="modal-close" id="modal-grid-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Microgrid Live Metrics Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">ROOFTOP SOLAR OUTPUT</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: #f59e0b; margin: 4px 0;">145.2 kW</div>
              <span style="font-size: 0.75rem; color: var(--status-high-text);">● 420 High-Efficiency Panels</span>
            </div>

            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">BESS BATTERY STORAGE</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--status-high-text); margin: 4px 0;">84.5% (380 kWh)</div>
              <span style="font-size: 0.75rem; color: var(--primary-600);">● Lithium Iron Phosphate Bank</span>
            </div>
          </div>

          <!-- Energy Flow Balance Card -->
          <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 18px; margin-bottom: 20px;">
            <strong style="font-size: 0.95rem; color: var(--text-primary); display: block; margin-bottom: 10px;">Facility Clean Energy Distribution</strong>
            
            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; margin-bottom: 8px;">
              <span style="color: var(--text-secondary);">⚡ EV Fast Charging Power:</span>
              <strong style="color: var(--accent-cyan);">68.0 kW (Clean Solar)</strong>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; margin-bottom: 8px;">
              <span style="color: var(--text-secondary);">💡 Deck Lighting & ANPR Cameras:</span>
              <strong>35.2 kW (BESS Buffered)</strong>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; border-top: 1px solid var(--border-color); padding-top: 8px;">
              <span style="color: var(--text-secondary);">🔌 Grid Net Feed-In Export:</span>
              <strong style="color: var(--status-high-text);">+42.0 kW Exported</strong>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-grid" style="width: 100%;">
            Close Clean Energy Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-grid-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-grid').addEventListener('click', closeModal);
  document.getElementById('modal-grid-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-grid-overlay') closeModal();
  });
}
