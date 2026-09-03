/**
 * SmartPark Fire-Resistant Duct Damper (UL 555) Modal Component
 * Monitors UL 555 3-hour fire dampers and 74°C (165°F) fusible links protecting HVAC duct penetrations.
 */

import { showToast } from './toast.js';

export function openFireDamperModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-fdn-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🚒 HVAC Fire Barrier Life Safety
            </span>
            <h3 class="modal-title">UL 555 Fire-Resistant Duct Damper</h3>
          </div>
          <button type="button" class="modal-close" id="modal-fdn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Fire Damper Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🚒🔥🛡️</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">UL 555 FIRE BARRIER INTEGRITY</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">3-Hour Fire Rated</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Open Airflow Normal (74.0°C / 165°F Fusible Link Armed - Duct Temp: 24.8°C)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Location: <strong style="color: var(--text-primary);">Substation Penetration</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Closure Torque: <strong style="color: var(--primary-600);">18.5 N·m Heavy Spring</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-fdn" style="width: 100%;">
            Close Fire Damper Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-fdn-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-fdn').addEventListener('click', closeModal);
  document.getElementById('modal-fdn-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-fdn-overlay') closeModal();
  });
}
