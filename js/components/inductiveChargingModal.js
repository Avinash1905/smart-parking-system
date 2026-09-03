/**
 * SmartPark Inductive Wireless EV Charging Modal Component
 * Displays hands-free 150kW underfloor magnetic resonance wireless power transfer.
 */

import { showToast } from './toast.js';

export function openInductiveChargingModal(slotCode = "W-01") {
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
    <div class="modal-overlay active" id="modal-ind-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              ⚡ Zero-Cable Wireless Charging
            </span>
            <h3 class="modal-title">150kW Inductive Resonant Pad</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ind-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Wireless Power Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">⚡📡</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">ACTIVE POWER TRANSFER</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">142.5 kW</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 94.8% High-Frequency Magnetic Efficiency
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Coil Alignment: <strong style="color: var(--status-high-text);">12 mm (Aligned)</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Debris Sensor: <strong style="color: var(--primary-600);">100% Clear</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-ind" style="width: 100%;">
            Close Wireless Charging Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ind-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-ind').addEventListener('click', closeModal);
  document.getElementById('modal-ind-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ind-overlay') closeModal();
  });
}
