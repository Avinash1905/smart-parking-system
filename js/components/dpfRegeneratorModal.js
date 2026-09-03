/**
 * SmartPark Diesel Particulate Filter (DPF) Soot Regenerator Modal Component
 * Monitors silicon carbide DPF matrix backpressures (4.2 kPa) and thermal soot incineration in emergency generators.
 */

import { showToast } from './toast.js';

export function openDPFRegeneratorModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-dpf-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🌿 Clean Exhaust Emission
            </span>
            <h3 class="modal-title">Generator DPF Soot Regenerator</h3>
          </div>
          <button type="button" class="modal-close" id="modal-dpf-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- DPF Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🌿🔥⚙️</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">PARTICULATE CAPTURE EFFICIENCY</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">99.8% Soot Trapped</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● EPA Tier 4 Final Emission Clean (4.2 kPa Backpressure - Limit: 15.0 kPa)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Core Temp: <strong style="color: var(--text-primary);">580.0°C Passive</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Soot Load: <strong style="color: var(--status-high-text);">12.5g (Pristine)</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-dpf" style="width: 100%;">
            Close DPF Filter Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-dpf-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-dpf').addEventListener('click', closeModal);
  document.getElementById('modal-dpf-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-dpf-overlay') closeModal();
  });
}
