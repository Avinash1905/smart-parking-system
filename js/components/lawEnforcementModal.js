/**
 * SmartPark Law Enforcement Hotlist & Security Alert Modal Component
 * Displays police watchlist matches, emergency barrier lockdown states, and central dispatch notices.
 */

import { showToast } from './toast.js';

export function openLawEnforcementModal() {
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
    <div class="modal-overlay active" id="modal-police-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🚨 Police Hotlist Interface
            </span>
            <h3 class="modal-title">Law Enforcement Security Alert</h3>
          </div>
          <button type="button" class="modal-close" id="modal-police-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Police Alert Card -->
          <div style="background: rgba(239,68,68,0.08); border: 2px solid #ef4444; border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge" style="background: #ef4444; color: #ffffff; font-weight: 800;">
                  CRIME DATABASE HIT
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  Stolen Vehicle Report (FIR-2026-8902)
                </h4>
              </div>
              <strong style="font-family: monospace; font-size: 1.2rem; color: #ef4444;">KA-04-XX-9999</strong>
            </div>

            <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; border-top: 1px solid rgba(239,68,68,0.2); padding-top: 10px;">
              <div>Issuing Agency: <strong>Bengaluru City Police Central Control Room</strong></div>
              <div>Automated Action: <strong>Exit Boom Barrier Lockdown Engaged</strong></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-police-override" style="justify-content: center;">
              Operator Override (False Alarm)
            </button>
            <button type="button" class="btn btn-primary btn-sm" id="btn-police-dispatch" style="justify-content: center; background: #ef4444;">
              🚨 Transmit GPS to Police Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-police-close').addEventListener('click', closeModal);
  document.getElementById('modal-police-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-police-overlay') closeModal();
  });

  document.getElementById('btn-police-override').addEventListener('click', () => {
    showToast("Operator override applied. Gate lock disengaged.", "info", 2000);
    closeModal();
  });

  document.getElementById('btn-police-dispatch').addEventListener('click', () => {
    showToast("Live facility camera and bay coordinates transmitted to Police 112 Control Room!", "success", 3000);
    closeModal();
  });
}
