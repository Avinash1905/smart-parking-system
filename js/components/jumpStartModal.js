/**
 * SmartPark Emergency Battery Jump-Start Assistance Modal Component
 * Enables motorists to request immediate mobile 2500A lithium jump-start service cart dispatch.
 */

import { showToast } from './toast.js';

export function openJumpStartModal(slotCode = "A-04") {
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
    <div class="modal-overlay active" id="modal-jsc-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(245,158,11,0.15); color: #f59e0b; margin-bottom: 4px;">
              ⚡ Roadside Assistance
            </span>
            <h3 class="modal-title">Emergency Battery Jump-Start</h3>
          </div>
          <button type="button" class="modal-close" id="modal-jsc-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Jump Cart Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🔋⚡🚗</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">FREE MOTORIST ROADSIDE SERVICE</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #f59e0b; margin: 4px 0;">2,500A Peak Lithium</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Mobile Cart Ready (Reverse Polarity Safe - 98% Charged)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Target Stall: <strong style="color: var(--text-primary);">Stall ${slotCode}</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>ETA: <strong style="color: var(--primary-600);">~ 2 Minutes Dispatch</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-request-jump-start" style="width: 100%; justify-content: center;">
            ⚡ Dispatch Jump-Start Cart to Stall ${slotCode} →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-jsc-close').addEventListener('click', closeModal);
  document.getElementById('btn-request-jump-start').addEventListener('click', () => {
    showToast(`Mobile jump-start cart dispatched to stall ${slotCode}! Facility technician arriving in ~2 mins.`, "success", 3500);
    closeModal();
  });
  document.getElementById('modal-jsc-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-jsc-overlay') closeModal();
  });
}
