/**
 * SmartPark Bioretention Rain Garden & Silt Trap Modal Component
 * Monitors natural bio-soil stormwater filtration basins removing sediment (3.8 NTU) and tire heavy metals.
 */

import { showToast } from './toast.js';

export function openRainGardenModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-rgf-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🌱 Low-Impact Urban Drainage
            </span>
            <h3 class="modal-title">Bioretention Rain Garden Bioswale</h3>
          </div>
          <button type="button" class="modal-close" id="modal-rgf-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Bioswale Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🌱🌿🌊</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">STORMWATER FILTRATION EFFICIENCY</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">94.5% Heavy Metals Removed</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 3.8 NTU Effluent Clarity (48,200 L Clean Rainwater Filtered Today)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Bio-Media Depth: <strong style="color: var(--text-primary);">1.20m Engineered Soil</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Certification: <strong style="color: var(--status-high-text);">EPA LID Green Bioswale</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-rgf" style="width: 100%;">
            Close Bioswale Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-rgf-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-rgf').addEventListener('click', closeModal);
  document.getElementById('modal-rgf-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-rgf-overlay') closeModal();
  });
}
