/**
 * SmartPark Solar Irradiance & Rooftop PV Forecast Modal Component
 * Monitors live pyranometers, solar flux, and predicts hourly renewable generation for EV charging.
 */

import { showToast } from './toast.js';

export function openSolarForecastModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-sol-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(245,158,11,0.15); color: #f59e0b; margin-bottom: 4px;">
              ☀️ Renewable Microgrid
            </span>
            <h3 class="modal-title">Rooftop Solar PV Forecast</h3>
          </div>
          <button type="button" class="modal-close" id="modal-sol-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Solar Flux Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">LIVE SOLAR IRRADIANCE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #f59e0b; margin: 4px 0;">842.5 W/m²</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Peak Insolation (48.2 kW Generating)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Daily Forecast: <strong style="color: var(--text-primary);">380.0 kWh Total</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>CO₂ Avoided: <strong style="color: var(--status-high-text);">184.2 kg Offset</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-solar" style="width: 100%;">
            Close Solar Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-sol-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-solar').addEventListener('click', closeModal);
  document.getElementById('modal-sol-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-sol-overlay') closeModal();
  });
}
