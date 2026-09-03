/**
 * SmartPark City-Wide Variable Message Sign (VMS) Roadside Network Component
 * Displays live street-level LED signboards directing highway traffic to vacant municipal decks.
 */

import { showToast } from './toast.js';

export function openVMSNetworkSyncModal() {
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

  const boards = [
    { id: "VMS-ROAD-MG-01", loc: "MG Road / Trinity Junction", msg: "CUBBON PARK DECK: 42 OPEN | MG METRO: 18 OPEN", status: "LIVE ONLINE" },
    { id: "VMS-ROAD-ECITY-02", loc: "Hosur Road Expressway Plaza", msg: "TCS ALPHA DECK: 72 OPEN (EMP) | VISITORS: 22 OPEN", status: "LIVE ONLINE" },
    { id: "VMS-ROAD-INDIRA-03", loc: "100ft Road / CMH Crossing", msg: "INDIRANAGAR CIVIC DECK: 52 OPEN", status: "LIVE ONLINE" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-vms-net-overlay">
      <div class="modal-content" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Arterial Traffic Control</span>
            <h3 class="modal-title">City Roadside VMS LED Network</h3>
          </div>
          <button type="button" class="modal-close" id="modal-vms-net-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Synchronized arterial road signs dynamic update every 5 seconds to route incoming suburban drivers to open parking bays.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${boards.map(b => `
              <div style="background: #090d16; border: 2px solid #1f2937; border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <strong style="color: #ffffff; font-size: 0.95rem;">${b.loc}</strong>
                  <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: #10b981;">● ${b.status}</span>
                </div>
                <!-- LED Matrix Message -->
                <div style="font-family: 'Courier New', monospace; font-size: 0.95rem; font-weight: 800; color: #f59e0b; background: #030712; padding: 10px 14px; border-radius: 6px; border: 1px solid #374151;">
                  ${b.msg}
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-sync-all-vms" style="width: 100%;">
            ⚡ Force Real-Time Network Sync Broadcast
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-vms-net-close').addEventListener('click', closeModal);
  document.getElementById('btn-sync-all-vms').addEventListener('click', () => {
    showToast("Live capacity counts transmitted to all 24 arterial VMS boards!", "success", 2500);
  });
  document.getElementById('modal-vms-net-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-vms-net-overlay') closeModal();
  });
}
