/**
 * SmartPark IoT Sensor Mesh Firmware Over-The-Air (OTA) Modal Component
 * Monitors wireless firmware flashes across 400+ ultrasonic slot sensors with zero downtime.
 */

import { showToast } from './toast.js';

export function openSensorOTAModal() {
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
    <div class="modal-overlay active" id="modal-ota-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              📡 IoT Mesh Engineering
            </span>
            <h3 class="modal-title">Sensor Firmware OTA Rollout</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ota-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- OTA Progress Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
                  ● 98.1% FLASHED (412/420 NODES)
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  Firmware v3.4.2-STABLE
                </h4>
              </div>
              <strong style="font-family: monospace; font-size: 0.9rem; color: var(--primary-600);">CRC32: 0x8F4A19B2</strong>
            </div>

            <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; border-top: 1px solid var(--border-color); padding-top: 10px;">
              <div>Mesh Protocol: <strong>6LoWPAN / CoAP 250 kbps</strong></div>
              <div>Release: <strong>15% lower sleep current + humidity ultrasonic filtering</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-force-mesh-flash" style="width: 100%;">
            ⚡ Broadcast Firmware Binary to Remaining 8 Nodes
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ota-close').addEventListener('click', closeModal);
  document.getElementById('btn-force-mesh-flash').addEventListener('click', () => {
    showToast("Wireless multicast flash completed! 420 of 420 ultrasonic sensors updated to v3.4.2.", "success", 2500);
  });
  document.getElementById('modal-ota-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ota-overlay') closeModal();
  });
}
