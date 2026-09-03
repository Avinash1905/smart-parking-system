/**
 * SmartPark Rooftop Patrol Drone Nest & Flight Dispatch Modal Component
 * Monitors automated drone hangar charging pads and launches scheduled thermal perimeter sweeps.
 */

import { showToast } from './toast.js';

export function openPatrolDroneModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-drone-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🚁 Aerial Security
            </span>
            <h3 class="modal-title">Autonomous Drone Nest</h3>
          </div>
          <button type="button" class="modal-close" id="modal-drone-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Drone Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 6px;">🚁</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● CHARGED (98% INDUCTION PAD)
            </span>
            <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 8px 0 4px;">
              SKY-GUARD-01 Ready
            </h4>
            <span style="font-size: 0.8125rem; color: var(--text-secondary);">
              Weather-sealed rooftop hangar nest ready for 4K FLIR thermal infrared patrol flight.
            </span>
          </div>

          <button type="button" class="btn btn-primary" id="btn-launch-drone-patrol" style="width: 100%; justify-content: center;">
            🚀 Open Hangar & Launch Immediate Perimeter Sweep
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-drone-close').addEventListener('click', closeModal);
  document.getElementById('btn-launch-drone-patrol').addEventListener('click', () => {
    showToast("Hangar roof door opened! SKY-GUARD-01 airborne on 15-minute perimeter flight route.", "success", 3000);
    closeModal();
  });
  document.getElementById('modal-drone-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-drone-overlay') closeModal();
  });
}
