/**
 * SmartPark Automated Valet Parking & Robotic Retrieval Component
 * Contactless valet drop-off, key locker security pins, and 3-minute retrieval countdown.
 */

import { showToast } from './toast.js';

export function openValetParkingModal(zoneName = "Municipal Central Parking") {
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

  const ticketCode = "VALET-88219A";
  const pin = "7412";
  const roboticStall = "ROBOTIC-ASRS-BAY-24";

  const modalHtml = `
    <div class="modal-overlay active" id="modal-valet-overlay">
      <div class="modal-content" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🤖 Automated Valet Network
            </span>
            <h3 class="modal-title">Digital Valet Pass</h3>
          </div>
          <button type="button" class="modal-close" id="modal-valet-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Digital Valet Ticket Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px; text-align: center;">
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">DIGITAL VALET TICKET ID</span>
            <div style="font-family: monospace; font-size: 1.6rem; font-weight: 800; color: var(--primary-600); letter-spacing: 0.08em; margin: 4px 0 12px;">
              ${ticketCode}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: var(--bg-surface); border-radius: var(--radius-lg); padding: 12px; margin-bottom: 12px;">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">ROBOTIC CONVEYOR</span>
                <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">${roboticStall}</div>
              </div>
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted);">KEY LOCKER PIN</span>
                <div style="font-size: 0.95rem; font-weight: 800; color: var(--status-high-text);">${pin}</div>
              </div>
            </div>

            <span style="font-size: 0.78rem; color: var(--text-secondary);">
              Drop keys at Smart Locker #3 and enter PIN ${pin}.
            </span>
          </div>

          <!-- Retrieval Request Action -->
          <div id="valet-retrieval-action-box">
            <button type="button" class="btn btn-primary" id="btn-request-valet-car" style="width: 100%; justify-content: center; font-size: 1rem; padding: 12px;">
              🚗 Request Vehicle Retrieval (3 Mins)
            </button>
          </div>

          <div id="valet-countdown-box" style="display: none; background: rgba(16,185,129,0.1); border: 1.5px solid #10b981; border-radius: var(--radius-lg); padding: 16px; text-align: center;">
            <span style="font-size: 0.8125rem; color: var(--status-high-text); font-weight: 700;">ROBOTIC CONVEYOR IN MOTION</span>
            <div style="font-size: 1.8rem; font-weight: 800; color: #10b981; margin: 6px 0;">02:45</div>
            <span style="font-size: 0.78rem; color: var(--text-secondary);">Your vehicle is being conveyed to Ground Floor Bay #1.</span>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-valet-close').addEventListener('click', closeModal);
  document.getElementById('modal-valet-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-valet-overlay') closeModal();
  });

  document.getElementById('btn-request-valet-car').addEventListener('click', () => {
    document.getElementById('valet-retrieval-action-box').style.display = 'none';
    document.getElementById('valet-countdown-box').style.display = 'block';
    showToast("Robotic retrieval sequence started! Vehicle ready in ~3 mins.", "success", 2500);
  });
}
