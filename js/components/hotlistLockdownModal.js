/**
 * SmartPark Stolen Vehicle Police Hotlist & Lockdown Modal Component
 * Displays real-time hotlist ANPR match alerts, automated gate containment, and police dispatch tokens.
 */

import { showToast } from './toast.js';

export function openHotlistLockdownModal(plate = "KA-04-E-1337") {
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
    <div class="modal-overlay active" id="modal-hotlist-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🚨 Police CCTNS Hotlist Match
            </span>
            <h3 class="modal-title">Stolen Vehicle Containment</h3>
          </div>
          <button type="button" class="modal-close" id="modal-hotlist-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="background: rgba(239,68,68,0.08); border: 2px solid #ef4444; border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge" style="background: #ef4444; color: #ffffff; font-weight: 800;">
                  ● STOLEN VEHICLE FLAGGED
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  Plate: ${plate}
                </h4>
              </div>
              <strong style="font-family: monospace; font-size: 1.1rem; color: #ef4444;">INC-POL-091</strong>
            </div>

            <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; border-top: 1px solid rgba(239,68,68,0.2); padding-top: 10px;">
              <div>Barrier Action: <strong style="color: #ef4444;">North Gate Entry Locked (Containment Mode)</strong></div>
              <div>Police Dispatch: <strong>Cubbon Park Police Station (Unit 4 En Route)</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-hotlist" style="width: 100%;">
            Acknowledge Law Enforcement Incident
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-hotlist-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-hotlist').addEventListener('click', closeModal);
  document.getElementById('modal-hotlist-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-hotlist-overlay') closeModal();
  });
}
