/**
 * SmartPark Substation SF6 Switchgear Leak Sniffer Modal Component
 * Monitors SF6 dielectric gas density (6.20 bar abs) and zero-leak environmental protection in high-voltage breakers.
 */

import { showToast } from './toast.js';

export function openSF6SnifferModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-sf6-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(245,158,11,0.15); color: #f59e0b; margin-bottom: 4px;">
              ⚡ High-Voltage GIS Safety
            </span>
            <h3 class="modal-title">Substation SF6 Gas Density &amp; Leak Sniffer</h3>
          </div>
          <button type="button" class="modal-close" id="modal-sf6-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- SF6 Status Card -->
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.2rem; margin-bottom: 4px;">⚡🧪🛡️</div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">DIELECTRIC SF6 GAS DENSITY</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">6.20 Bar Abs (@ 20°C)</div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
              ● Zero Atmospheric Leak (0.0 PPM Sniffed - Density Limit: &gt; 5.50 Bar)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 20px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Annual Leak Rate: <strong style="color: var(--status-high-text);">0.05% / Year (Pristine)</strong></div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div>Standard: <strong style="color: var(--primary-600);">IEC 62271-203 GIS</strong></div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-sf6" style="width: 100%;">
            Close SF6 Density Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-sf6-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-sf6').addEventListener('click', closeModal);
  document.getElementById('modal-sf6-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-sf6-overlay') closeModal();
  });
}
