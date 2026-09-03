/**
 * SmartPark Pedestrian Safety & Crosswalk Motion Radar Component
 * Real-time monitoring of drive aisle pedestrian crossings, blind corner flashers, and speed calming loops.
 */

import { showToast } from './toast.js';

export function openPedestrianSafetyModal(zoneName = "Municipal Central Parking") {
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

  const crosswalks = [
    { code: "CW-ELEV-LOBBY-01", loc: "Floor G Elevator Main Crossing", state: "CLEAR (STANDBY)", flasher: "OFF", color: "var(--status-high-text)" },
    { code: "CW-B1-RAMP-02", loc: "Floor B1 Helical Ramp Corner", state: "CLEAR (STANDBY)", flasher: "OFF", color: "var(--status-high-text)" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-ped-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🚶 Pedestrian Vision
            </span>
            <h3 class="modal-title">Drive Aisle Crosswalk Safety</h3>
          </div>
          <button type="button" class="modal-close" id="modal-ped-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            24 GHz microwave Doppler radar nodes detect walking commuters and actuate amber warning flashers around blind turns.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${crosswalks.map(c => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${c.loc}</strong>
                  <span class="badge badge-public" style="color: ${c.color};">● ${c.state}</span>
                </div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary); font-family: monospace;">
                  Node: ${c.code} • Warning Flasher: ${c.flasher}
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-trigger-ped-test" style="width: 100%;">
            ⚡ Simulate Pedestrian Entering Elevator Crosswalk
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-ped-close').addEventListener('click', closeModal);
  document.getElementById('btn-trigger-ped-test').addEventListener('click', () => {
    showToast("Doppler radar triggered! Amber warning flashers active on Floor G drive aisle.", "warning", 3000);
  });
  document.getElementById('modal-ped-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-ped-overlay') closeModal();
  });
}
