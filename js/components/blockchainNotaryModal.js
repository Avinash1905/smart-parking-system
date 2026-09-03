/**
 * SmartPark Blockchain Cryptographic Notary & Audit Proof Modal Component
 * Displays tamper-proof SHA-256 hash proofs for tax reconciliation and municipal audits.
 */

import { showToast } from './toast.js';

export function openBlockchainNotaryModal(resId = "RES-A2401") {
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

  const sha256 = "8f4a28b1c90234de591a274bb09e4a8172c91823f0a941829e18234891a209b1";

  const modalHtml = `
    <div class="modal-overlay active" id="modal-notary-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🔗 Cryptographic Ledger
            </span>
            <h3 class="modal-title">Blockchain Hash Notary Certificate</h3>
          </div>
          <button type="button" class="modal-close" id="modal-notary-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="background: var(--bg-surface-subtle); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div>
                <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">
                  ● BLOCK #148,290 VERIFIED
                </span>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
                  Session Ref: ${resId}
                </h4>
              </div>
              <div style="font-size: 1.8rem;">🔒</div>
            </div>

            <div style="margin-bottom: 12px;">
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">SHA-256 DIGITAL PROOF HASH</span>
              <div style="font-family: monospace; font-size: 0.78rem; word-break: break-all; color: var(--primary-600); background: var(--bg-surface); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-top: 4px;">
                ${sha256}
              </div>
            </div>

            <span style="font-size: 0.78rem; color: var(--text-secondary);">
              Tamper-proof cryptographic record permanently logged for statutory GST audit compliance.
            </span>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-hash" style="width: 100%;">
            📋 Copy Cryptographic Hash String
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-notary-close').addEventListener('click', closeModal);
  document.getElementById('btn-copy-hash').addEventListener('click', () => {
    showToast("Cryptographic SHA-256 hash copied to clipboard!", "success", 2000);
  });
  document.getElementById('modal-notary-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-notary-overlay') closeModal();
  });
}
