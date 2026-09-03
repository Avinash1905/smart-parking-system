/**
 * SmartPark Emergency Vehicle Green Wave Corridor Component
 * Sub-150ms automated acoustic siren detection and zero-delay barrier release for ambulances.
 */

import { showToast } from './toast.js';

export function openEmergencyVehicleModal() {
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
    <div class="modal-overlay active" id="modal-emg-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🚑 Emergency Green Wave
            </span>
            <h3 class="modal-title">Priority Siren Clearance</h3>
          </div>
          <button type="button" class="modal-close" id="modal-emg-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Emergency Vehicle Status Card -->
          <div style="background: rgba(239,68,68,0.08); border: 2px solid #ef4444; border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div>
                <span class="badge" style="background: #ef4444; color: #ffffff; font-weight: 800;">
                  ● SIREN FREQUENCY DETECTED (700-1500 Hz)
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  108 State Emergency Ambulance
                </h4>
              </div>
              <strong style="font-family: monospace; font-size: 1.2rem; color: #ef4444;">KA-01-AMB-108</strong>
            </div>

            <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; border-top: 1px solid rgba(239,68,68,0.2); padding-top: 10px;">
              <div>Assigned Corridor: <strong>North Entry Gate #1 (Priority Express Lane)</strong></div>
              <div>Boom Barrier Latency: <strong style="color: var(--status-high-text);">120 ms Zero-Wait Release</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-trigger-emg-wave" style="width: 100%; justify-content: center; background: #ef4444;">
            🚨 Simulate Approaching Ambulance Passage
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-emg-close').addEventListener('click', closeModal);
  document.getElementById('modal-emg-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-emg-overlay') closeModal();
  });

  document.getElementById('btn-trigger-emg-wave').addEventListener('click', () => {
    showToast("Acoustic siren verified! All North Gate entry barriers raised to 100% vertical.", "success", 3000);
    closeModal();
  });
}
