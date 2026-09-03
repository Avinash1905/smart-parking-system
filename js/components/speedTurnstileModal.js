/**
 * SmartPark Pedestrian Speed Gate Turnstile Modal Component
 * Monitors motorized glass flap turnstiles, optical anti-tailgating sensors, and pedestrian throughput.
 */

import { showToast } from './toast.js';

export function openSpeedTurnstileModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-stl-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🚶 Pedestrian Access Control
            </span>
            <h3 class="modal-title">Optical Speed Gate Turnstile</h3>
          </div>
          <button type="button" class="modal-close" id="modal-stl-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Turnstile Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚶🚪✨</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">PEDESTRIAN THROUGHPUT</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">1,420 Entries Today</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 45 Pedestrians/Min Rate (32-Point Infrared Anti-Tailgating)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Flap Action: <strong style="color: var(--text-primary);">0.3s Rapid Brushless</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Auth Modes: <strong style="color: var(--primary-600);">QR / NFC / RFID</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-pulse-turnstile" style="width: 100%;">
            ⚡ Open Turnstile Glass Flaps for 5-Second Test
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-stl-close').addEventListener('click', closeModal);
  document.getElementById('btn-pulse-turnstile').addEventListener('click', () => {
    showToast("Turnstile glass flaps retracted! Optical passage cleared for pedestrian entry.", "success", 2500);
  });
  document.getElementById('modal-stl-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-stl-overlay') closeModal();
  });
}
