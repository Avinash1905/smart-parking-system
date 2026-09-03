/**
 * SmartPark Transformer Dissolved Gas Analysis (DGA) Modal Component
 * Monitors insulating oil dissolved combustible gases (IEEE C57.104 Condition 1 Normal) in high-voltage transformers.
 */

import { showToast } from './toast.js';

export function openDGASensorModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-dga-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(245,158,11,0.15); color: #f59e0b; margin-bottom: 4px;">
              ⚡ Substation Transformer Health
            </span>
            <h3 class="modal-title">Dissolved Gas Analysis (DGA)</h3>
          </div>
          <button type="button" class="modal-close" id="modal-dga-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- DGA Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">⚡🧪🛢️</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">TOTAL COMBUSTIBLE GASES (TCG)</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">38.0 PPM (Condition 1)</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● IEEE C57.104 Normal Pristine (H₂: 14.5 ppm | C₂H₂ Arcing: 0.4 ppm)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Oil Temperature: <strong style="color: var(--text-primary);">58.4°C (Normal)</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Duval Triangle: <strong style="color: var(--status-high-text);">No Fault Zone</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-dga" style="width: 100%;">
            Close DGA Oil Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-dga-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-dga').addEventListener('click', closeModal);
  document.getElementById('modal-dga-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-dga-overlay') closeModal();
  });
}
