/**
 * SmartPark Waste Compactor & Bin Fill-Level Modal Component
 * Monitors hydraulic smart trash compactors with 5:1 volume reduction and odor neutralizers.
 */

import { showToast } from './toast.js';

export function openWasteCompactorModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-waste-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Facility Sanitation</span>
            <h3 class="modal-title">Smart Waste Compactor</h3>
          </div>
          <button type="button" class="modal-close" id="modal-waste-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Compactor Fill Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">BIN FILL LEVEL</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">38.4% Full</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 5:1 Volume Compaction Active (Odor Mist Spray ON)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Hydraulic Ram: <strong style="color: var(--text-primary);">1,850 PSI</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Next Pickup: <strong style="color: var(--primary-600);">Tomorrow, 06:00 AM</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-trigger-compaction" style="width: 100%;">
            ⚡ Run Manual 15-Second Hydraulic Compactor Cycle
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-waste-close').addEventListener('click', closeModal);
  document.getElementById('btn-trigger-compaction').addEventListener('click', () => {
    showToast("Hydraulic ram completed compaction cycle! Bin volume reduced by 80%.", "success", 2500);
  });
  document.getElementById('modal-waste-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-waste-overlay') closeModal();
  });
}
