/**
 * SmartPark Carbon Credit Registry & Verified Carbon Standard Modal Component
 * Displays certified greenhouse gas offsets and blockchain minted carbon credits.
 */

import { showToast } from './toast.js';

export function openCarbonRegistryModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-carbon-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🌱 Verified Carbon Standard (VCS)
            </span>
            <h3 class="modal-title">Carbon Credit Registry Certificate</h3>
          </div>
          <button type="button" class="modal-close" id="modal-carbon-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Carbon Offset Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">TOTAL VERIFIED CO₂ OFFSET</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">142.8 Metric Tons</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Minted on Carbon Registry (Valued at $4,069.80 USD)
            </span>
          </div>

          <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 16px; font-size: 0.8125rem; color: var(--text-secondary);">
            <div>VCS ID: <strong>VCS-PROJ-99214</strong></div>
            <div>Ledger Hash: <strong style="font-family: monospace; color: var(--primary-600);">0x89f2a410b0d3e57199bc4c0128e469b2...</strong></div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-download-carbon-cert" style="width: 100%;">
            📄 Download Verified ESG Carbon Certificate PDF
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-carbon-close').addEventListener('click', closeModal);
  document.getElementById('btn-download-carbon-cert').addEventListener('click', () => {
    showToast("Official Verified Carbon Standard certificate downloaded!", "success", 2500);
  });
  document.getElementById('modal-carbon-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-carbon-overlay') closeModal();
  });
}
