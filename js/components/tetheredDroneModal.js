/**
 * SmartPark Tethered Aerial Security Drone Modal Component
 * Monitors 24/7 continuous micro-tether powered 4K FLIR surveillance drones hovering at 45m altitude.
 */

import { showToast } from './toast.js';

export function openTetheredDroneModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-tdn-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🚁 24/7 Airspace Guard
            </span>
            <h3 class="modal-title">Tethered Persistent Drone Watch</h3>
          </div>
          <button type="button" class="modal-close" id="modal-tdn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Drone Hover Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚁📡</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">PERSISTENT AIRBORNE WATCH</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">45m Altitude Hover</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 168.5 Hours Continuous Airborne Uptime (Tethered 400V Micro-Power)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Optics: <strong style="color: var(--text-primary);">30x Optical 4K FLIR</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Fiber Link: <strong style="color: var(--primary-600);">10 Gbps Uncompressed</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-tdn" style="width: 100%;">
            Close Tethered Drone Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-tdn-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-tdn').addEventListener('click', closeModal);
  document.getElementById('modal-tdn-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-tdn-overlay') closeModal();
  });
}
