/**
 * SmartPark Autonomous Valet Parking (AVP Level 4) Trajectory Modal Component
 * Displays real-time Lidar localization anchors and driverless vehicle trajectory splines.
 */

import { showToast } from './toast.js';

export function openAVPTrajectoryModal(missionCode = "AVP-MIS-4820") {
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
    <div class="modal-overlay active" id="modal-avp-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🤖 Level 4 Driverless Valet
            </span>
            <h3 class="modal-title">Autonomous Vehicle Path Tracking</h3>
          </div>
          <button type="button" class="modal-close" id="modal-avp-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Mission Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
                  ● AUTONOMOUS TRANSIT ACTIVE
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  Vehicle KA-01-EQ-9988
                </h4>
              </div>
              <strong style="font-family: monospace; font-size: 1.1rem; color: var(--primary-600);">${missionCode}</strong>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.84rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 10px;">
              <div>Route: <strong>Dropoff Bay → Stall B2-44</strong></div>
              <div>Waypoints: <strong>48 HD Splines</strong></div>
              <div>Distance: <strong>184.5 Meters</strong></div>
              <div>Lidar Confidence: <strong style="color: var(--status-high-text);">99.8% Match</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-avp" style="width: 100%;">
            Close Autonomous Mission Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-avp-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-avp').addEventListener('click', closeModal);
  document.getElementById('modal-avp-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-avp-overlay') closeModal();
  });
}
