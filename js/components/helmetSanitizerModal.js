/**
 * SmartPark Two-Wheeler Helmet UV-C Sanitizer Modal Component
 * Enables motorcycle & scooter commuters to sanitize helmets using 254nm germicidal UV-C light in 90 seconds.
 */

import { showToast } from './toast.js';

export function openHelmetSanitizerModal() {
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
    <div class="modal-overlay active" id="modal-hsv-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🛵 Rider Hygiene
            </span>
            <h3 class="modal-title">Helmet UV-C Sanitizer Lockbox</h3>
          </div>
          <button type="button" class="modal-close" id="modal-hsv-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Sanitizer Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">🪖✨</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">GERMICIDAL STERILIZATION</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">99.99% Pathogen Kill</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 254nm Medical UV-C Chamber (90s Sterilization Cycle)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Locker Code: <strong style="color: var(--text-primary);">HELMET-UVC-04</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>UV-C Intensity: <strong style="color: var(--primary-600);">850 µW/cm²</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-unlock-helmet-box" style="width: 100%; justify-content: center;">
            🪖 Open Chamber Door & Start 90s UV-C Sterilization →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-hsv-close').addEventListener('click', closeModal);
  document.getElementById('btn-unlock-helmet-box').addEventListener('click', () => {
    showToast("Chamber door released! Place helmet inside and close door to begin 90-second UV-C sterilize.", "success", 3000);
    closeModal();
  });
  document.getElementById('modal-hsv-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-hsv-overlay') closeModal();
  });
}
