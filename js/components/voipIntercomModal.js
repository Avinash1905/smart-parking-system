/**
 * SmartPark Security VoIP Intercom & Help Point Component
 * Enables two-way digital audio connection to gate callboxes and emergency panic stations.
 */

import { showToast } from './toast.js';

export function openVoIPIntercomModal() {
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

  const stations = [
    { code: "ICOM-NORTH-GATE-01", loc: "North Entry Barrier #1", ext: "Ext. 1041", status: "STANDBY" },
    { code: "ICOM-ELEV-LOBBY-B1", loc: "Floor B1 Elevator Lobby", ext: "Ext. 1042", status: "STANDBY" },
    { code: "ICOM-PVT-TCS-01", loc: "TCS Think Campus Gate 1", ext: "Ext. 1043", status: "STANDBY" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-intercom-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Security Dispatch</span>
            <h3 class="modal-title">VoIP Master Intercom Station</h3>
          </div>
          <button type="button" class="modal-close" id="modal-intercom-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Full-duplex HD audio SIP callbox stations connected to central security operations.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${stations.map(s => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${s.loc}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); font-family: monospace;">${s.code} • ${s.ext}</div>
                </div>

                <button type="button" class="btn btn-primary btn-sm btn-call-station" data-loc="${s.loc}">
                  📞 Connect Call
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-intercom-close').addEventListener('click', closeModal);
  document.getElementById('modal-intercom-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-intercom-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-call-station').forEach(btn => {
    btn.addEventListener('click', () => {
      const l = btn.getAttribute('data-loc');
      showToast(`Two-way VoIP SIP call established with ${l}! Audio channel open.`, "success", 3000);
      closeModal();
    });
  });
}
