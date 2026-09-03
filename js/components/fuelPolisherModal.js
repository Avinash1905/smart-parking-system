/**
 * SmartPark Diesel Generator Fuel Polisher Modal Component
 * Monitors automated diesel fuel centrifuges and water separators ensuring 100% emergency generator reliability.
 */

import { showToast } from './toast.js';

export function openFuelPolisherModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-fpu-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(245,158,11,0.15); color: #f59e0b; margin-bottom: 4px;">
              ⚡ Emergency Power Backup
            </span>
            <h3 class="modal-title">Generator Diesel Fuel Polisher</h3>
          </div>
          <button type="button" class="modal-close" id="modal-fpu-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Fuel Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">⛽⚡</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">DIESEL FUEL CLEANLINESS</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">ISO 14/12/9 Pristine</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● 4,650 L Fuel Ready (24 PPM Water - ASTM D975 &lt; 200 PPM)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Recirculation: <strong style="color: var(--text-primary);">600 L/Hour Active</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Generator: <strong style="color: var(--primary-600);">500 kVA Standby</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-fpu" style="width: 100%;">
            Close Fuel Polisher Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-fpu-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-fpu').addEventListener('click', closeModal);
  document.getElementById('modal-fpu-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-fpu-overlay') closeModal();
  });
}
