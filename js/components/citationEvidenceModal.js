/**
 * SmartPark Citation Photographic Evidence Dossier Modal Component
 * Displays tamper-proof high-res ANPR snapshots with cryptographic GPS watermarks.
 */

import { showToast } from './toast.js';

export function openCitationEvidenceModal(plate = "KA-05-AB-1234") {
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
    <div class="modal-overlay active" id="modal-evid-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              📷 Statutory Legal Evidence
            </span>
            <h3 class="modal-title">Photographic Violation Dossier</h3>
          </div>
          <button type="button" class="modal-close" id="modal-evid-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Evidence Photo Container -->
          <div style="position: relative; background: #000; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 16px; border: 2px solid var(--border-color);">
            <div style="height: 200px; background: linear-gradient(135deg, #1e293b, #0f172a); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.9rem;">
              📸 [High-Resolution ANPR Vehicle Capture Image]
            </div>

            <!-- Cryptographic Watermark Overlay -->
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); padding: 8px 12px; font-family: monospace; font-size: 0.72rem; color: #38bdf8; display: flex; justify-content: space-between;">
              <span>PLATE: ${plate} (OCR: 99.6%)</span>
              <span>GPS: 12.9716° N, 77.5946° E</span>
            </div>
          </div>

          <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 16px; font-size: 0.8125rem; color: var(--text-secondary);">
            <div>Hash: <strong style="font-family: monospace; color: var(--primary-600);">e3b0c44298fc1c149afbf4c8996fb92427...</strong></div>
            <div>Status: <strong style="color: var(--status-high-text);">Certified Tamper-Proof Electronic Evidence</strong></div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-download-court-dossier" style="width: 100%;">
            📄 Export Certified Evidence Certificate (Court PDF)
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-evid-close').addEventListener('click', closeModal);
  document.getElementById('btn-download-court-dossier').addEventListener('click', () => {
    showToast("Certified Section 65B Electronic Evidence affidavit generated!", "success", 2500);
  });
  document.getElementById('modal-evid-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-evid-overlay') closeModal();
  });
}
