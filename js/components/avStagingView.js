/**
 * SmartPark Autonomous Vehicle (AV) Staging & Inductive Hub Component
 * Monitors self-driving robotaxi holding bays, inductive ground pads, and automated dispatch requests.
 */

import { showToast } from './toast.js';

export function openAVStagingModal() {
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

  const bays = [
    { bay: "AV-BAY-01", pod: "AV-POD-801", fleet: "Waymo Autonomous", status: "CHARGING (INDUCTIVE)", color: "var(--accent-cyan)" },
    { bay: "AV-BAY-02", pod: "AV-POD-802", fleet: "Cruise Origin", status: "READY FOR DISPATCH", color: "var(--status-high-text)" },
    { bay: "AV-BAY-03", pod: "AV-POD-803", fleet: "Zoox Autonomous", status: "READY FOR DISPATCH", color: "var(--status-high-text)" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-av-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan); margin-bottom: 4px;">
              🤖 Autonomous Mobility
            </span>
            <h3 class="modal-title">Robotaxi Staging & Inductive Hub</h3>
          </div>
          <button type="button" class="modal-close" id="modal-av-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Dedicated automated vehicle holding stalls equipped with 20kW in-ground magnetic wireless inductive charging pads.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${bays.map(b => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                    <strong style="font-family: monospace; color: var(--primary-600);">${b.bay}</strong>
                    <span style="font-size: 0.8125rem; color: var(--text-secondary);">(${b.pod} • ${b.fleet})</span>
                  </div>
                  <span style="font-size: 0.78rem; color: ${b.color}; font-weight: 700;">● ${b.status}</span>
                </div>

                <button type="button" class="btn btn-secondary btn-sm btn-dispatch-av" data-bay="${b.bay}">
                  Dispatch Pod
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-av-close').addEventListener('click', closeModal);
  document.getElementById('modal-av-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-av-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-dispatch-av').forEach(btn => {
    btn.addEventListener('click', () => {
      const b = btn.getAttribute('data-bay');
      showToast(`Autonomous Pod from ${b} dispatched to passenger pickup zone!`, "success", 2500);
      closeModal();
    });
  });
}
