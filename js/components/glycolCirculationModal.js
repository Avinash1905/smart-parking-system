/**
 * SmartPark Rooftop Hydronic Snow Melt Glycol Modal Component
 * Monitors closed-loop propylene glycol circulation pumps (48.5°C supply) melting rooftop ice and snow.
 */

import { showToast } from './toast.js';

export function openGlycolCirculationModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-gcn-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(245,158,11,0.15); color: #f59e0b; margin-bottom: 4px;">
              ❄️ Hydronic De-Icing
            </span>
            <h3 class="modal-title">Rooftop Glycol Snow Melt Pump</h3>
          </div>
          <button type="button" class="modal-close" id="modal-gcn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Hydronic Pump Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🔥❄️🔄</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">GLYCOL SUPPLY TEMPERATURE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #f59e0b; margin: 4px 0;">48.5°C Heated Loop</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Hydronic Melting Active (650 kBTU/hr Heat Output - 40% Glycol)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Return Temp: <strong style="color: var(--text-primary);">38.0°C (ΔT 10.5°C)</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Flow Rate: <strong style="color: var(--primary-600);">125.0 GPM Circulating</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-gcn" style="width: 100%;">
            Close Glycol Hydronic Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-gcn-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-gcn').addEventListener('click', closeModal);
  document.getElementById('modal-gcn-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-gcn-overlay') closeModal();
  });
}
