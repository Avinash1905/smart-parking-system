/**
 * SmartPark Ultrasonic Bird & Pigeon Deterrent Grid Modal Component
 * Displays bio-acoustic predator calls and ultrasonic pulses protecting car paint on open decks.
 */

import { showToast } from './toast.js';

export function openBirdDeterrentModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-bird-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🛡️ Car Paint Preservation
            </span>
            <h3 class="modal-title">Rooftop Bird Deterrent Grid</h3>
          </div>
          <button type="button" class="modal-close" id="modal-bird-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🦅📡</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">ROOFTOP PERIMETER STATUS</span>
            <div style="font-size: 1.8rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">100% Secure & Clear</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Humane Bio-Acoustic Pulse Active (45m Radius)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Paint Claims Saved: <strong style="color: var(--status-high-text);">42 Vehicles</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Nesting Incidents: <strong style="color: var(--primary-600);">0 Detected (30d)</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-bird" style="width: 100%;">
            Close Deterrent Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-bird-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-bird').addEventListener('click', closeModal);
  document.getElementById('modal-bird-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-bird-overlay') closeModal();
  });
}
