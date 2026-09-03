/**
 * SmartPark Under-Vehicle Threat Inspection (UVSS) Modal Component
 * Displays full 4K undercarriage line-scan captures and automated security threat clearances.
 */

import { showToast } from './toast.js';

export function openThreatInspectionModal(plate = "KA-01-MJ-5890") {
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
    <div class="modal-overlay active" id="modal-uvss-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🛡️ High-Security Gate Screen
            </span>
            <h3 class="modal-title">Under-Vehicle Threat Scan (UVSS)</h3>
          </div>
          <button type="button" class="modal-close" id="modal-uvss-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Undercarriage Photo Scan View -->
          <div style="position: relative; background: #000; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 16px; border: 2px solid var(--border-color);">
            <div style="height: 180px; background: linear-gradient(135deg, #1e293b, #090d16); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.9rem;">
              🔍 [4K Color Line-Scan Undercarriage Composite]
            </div>

            <!-- Scan Clearance Stamp -->
            <div style="position: absolute; top: 12px; right: 12px; background: rgba(16,185,129,0.9); padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.75rem; color: #fff;">
              ✓ SECURITY CLEARED
            </div>
          </div>

          <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 16px; font-size: 0.8125rem; color: var(--text-secondary); display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>Plate: <strong>${plate}</strong></div>
            <div>Threat Confidence: <strong style="color: var(--status-high-text);">0.0% (Zero Threats)</strong></div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-uvss" style="width: 100%;">
            Close Inspection Telemetry
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-uvss-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-uvss').addEventListener('click', closeModal);
  document.getElementById('modal-uvss-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-uvss-overlay') closeModal();
  });
}
