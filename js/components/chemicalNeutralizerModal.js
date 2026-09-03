/**
 * SmartPark Chemical Spill Neutralizer & Bio-Enzyme Modal Component
 * Monitors automated hydrocarbon-digesting enzyme sprayers for motor oil leak cleanup.
 */

import { showToast } from './toast.js';

export function openChemicalNeutralizerModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-cnz-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🧪 Bio-Remediation Safety
            </span>
            <h3 class="modal-title">Oil Spill Bio-Enzyme Neutralizer</h3>
          </div>
          <button type="button" class="modal-close" id="modal-cnz-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Neutralizer Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🧪🧯</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">SPILL REMEDIATION SYSTEM</span>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">Spill Response Armed</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 92.5% Enzyme Tank Full (15m Hydrocarbon Digestion)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--text-primary);">Floor B1 Service Aisle</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Enzyme Class: <strong style="color: var(--status-high-text);">EPA Safer Choice</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-dispense-enzyme-foam" style="width: 100%;">
            ⚡ Dispense Targeted 5-Second Bio-Enzyme Mist
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-cnz-close').addEventListener('click', closeModal);
  document.getElementById('btn-dispense-enzyme-foam').addEventListener('click', () => {
    showToast("Bio-enzyme foam mist dispensed! Hydrocarbons digesting safely on pavement.", "success", 2500);
  });
  document.getElementById('modal-cnz-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-cnz-overlay') closeModal();
  });
}
