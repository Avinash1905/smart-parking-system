/**
 * SmartPark Acoustic Sound Barrier Wall Modal Component
 * Monitors perimeter STC 45 acoustic insulation attenuating ramp tire screech and engine noise.
 */

import { showToast } from './toast.js';

export function openSoundBarrierModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-acb-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🔇 Environmental Noise Control
            </span>
            <h3 class="modal-title">STC 45 Acoustic Barrier Wall</h3>
          </div>
          <button type="button" class="modal-close" id="modal-acb-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Noise Reduction Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">PERIMETER NOISE REDUCTION</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">-32.2 dBA Attenuated</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Outside Boundary: 46.2 dBA (Municipal Limit &lt; 50.0 dBA)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Inside Garage Noise: <strong style="color: var(--text-primary);">78.4 dBA</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Sound Transmission: <strong style="color: var(--primary-600);">STC 45 Rated</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-acb" style="width: 100%;">
            Close Acoustic Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-acb-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-acb').addEventListener('click', closeModal);
  document.getElementById('modal-acb-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-acb-overlay') closeModal();
  });
}
