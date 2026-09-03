/**
 * SmartPark Nitrogen Foam (N-CAFS) EV Fire Suppression Modal Component
 * Monitors nitrogen-driven compressed air foam systems delivering 1:20 expansion blankets to extinguish EV battery thermal runaway.
 */

import { showToast } from './toast.js';

export function openNitrogenFoamModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-nfn-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🚒 EV Lithium Fire Life Safety
            </span>
            <h3 class="modal-title">Nitrogen Foam (N-CAFS) Fire Suppressor</h3>
          </div>
          <button type="button" class="modal-close" id="modal-nfn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- N-CAFS Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🧯⚡🔋</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">EV THERMAL RUNAWAY DEFENSE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">Rapid Smother Armed</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 1,850 PSI N₂ Pressure (1:20 High-Expansion Nitrogen Foam Blanket)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Foam Concentrate: <strong style="color: var(--text-primary);">800 Liters Reserve</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Flow Rate: <strong style="color: var(--primary-600);">400 GPM Rated</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-arm-ncafs" style="width: 100%;">
            ⚡ Verify Nitrogen Foam Battery Deluge Pressure
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-nfn-close').addEventListener('click', closeModal);
  document.getElementById('btn-arm-ncafs').addEventListener('click', () => {
    showToast("Nitrogen CAFS pressure verified at 1,850 PSI! High-expansion EV fire nozzles armed.", "success", 2500);
  });
  document.getElementById('modal-nfn-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-nfn-overlay') closeModal();
  });
}
