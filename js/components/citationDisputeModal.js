/**
 * SmartPark Citation Dispute & Appeal Modal Component
 * Enables drivers to file formal dispute appeals for parking violation notices.
 */

import { showToast } from './toast.js';

export function openCitationDisputeModal(violationId = "V-1024", fineAmount = 500) {
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
    <div class="modal-overlay active" id="modal-dispute-overlay">
      <div class="modal-content" style="max-width: 560px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: rgba(239,68,68,0.1); color: var(--status-low-text); margin-bottom: 4px;">
              Enforcement Appeal
            </span>
            <h3 class="modal-title">Dispute Notice #${violationId}</h3>
          </div>
          <button type="button" class="modal-close" id="modal-dispute-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 4px;">
              <span style="color: var(--text-secondary);">Violation Notice:</span>
              <strong>#${violationId} (Penalty: ₹${fineAmount})</strong>
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Filing an appeal pauses late payment fees during the 48-hour adjudication period.</span>
          </div>

          <form id="form-citation-dispute">
            <div class="input-group" style="margin-bottom: 14px;">
              <label class="input-label" for="dispute-reason-select">Primary Dispute Ground *</label>
              <select id="dispute-reason-select" class="input-control">
                <option value="TAG_READER_MALFUNCTION">RFID / Tag Reader Sensor Malfunction</option>
                <option value="VALID_VISITOR_PERMIT">Had Valid Manual Visitor Clearance from Host</option>
                <option value="ANPR_OCR_MISMATCH">ANPR Camera Incorrectly Read License Plate</option>
                <option value="MEDICAL_EMERGENCY">Medical / Mechanical Breakdown Emergency</option>
              </select>
            </div>

            <div class="input-group" style="margin-bottom: 18px;">
              <label class="input-label" for="dispute-explanation-input">Detailed Statement / Evidence Description *</label>
              <textarea id="dispute-explanation-input" class="input-control" rows="4" placeholder="Provide host employee contact or breakdown details..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
              Submit Dispute Appeal for Adjudication →
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-dispute-close').addEventListener('click', closeModal);
  document.getElementById('modal-dispute-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-dispute-overlay') closeModal();
  });

  document.getElementById('form-citation-dispute').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast(`Appeal registered for Notice #${violationId}! Penalty fee stayed.`, "success", 3000);
    closeModal();
  });
}
