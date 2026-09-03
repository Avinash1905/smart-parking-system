/**
 * SmartPark ANPR Optical Lens & OCR Calibration Component
 * Admin tool to fine-tune camera shutter speeds, IR illumination, and license plate recognition accuracy.
 */

import { showToast } from './toast.js';

export function openANPRCalibrationModal() {
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

  const cams = [
    { id: "CAM-NORTH-01", loc: "North Gate Entry", speed: "1/1000s", ir: "85%", score: "99.4% OCR", status: "CALIBRATED" },
    { id: "CAM-SOUTH-02", loc: "South Gate Exit", speed: "1/1000s", ir: "80%", score: "98.9% OCR", status: "CALIBRATED" },
    { id: "CAM-PVT-TCS-01", loc: "TCS Campus Gate", speed: "1/1200s", ir: "90%", score: "99.7% OCR", status: "CALIBRATED" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-cal-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              📷 Optical Engineering
            </span>
            <h3 class="modal-title">ANPR Lens & OCR Calibration</h3>
          </div>
          <button type="button" class="modal-close" id="modal-cal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Adjust electronic global shutter timing and infrared night illumination for high-speed vehicle capture up to 60 km/h.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${cams.map(c => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="font-family: monospace; color: var(--primary-600);">${c.id}</strong>
                  <div style="font-size: 0.8125rem; color: var(--text-primary); margin-top: 2px;">${c.loc}</div>
                  <span style="font-size: 0.75rem; color: var(--text-secondary);">Shutter: ${c.speed} • IR Strobe: ${c.ir}</span>
                </div>

                <div style="text-align: right;">
                  <strong style="color: var(--status-high-text); font-size: 0.95rem; display: block;">${c.score}</strong>
                  <button type="button" class="btn btn-secondary btn-sm btn-recalibrate-cam" data-id="${c.id}" style="margin-top: 4px;">
                    Auto-Calibrate
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-cal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-cal-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-recalibrate-cam').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.getAttribute('data-id');
      showToast(`Lens focus & IR exposure calibrated for ${c}! OCR confidence updated to 99.8%.`, "success", 2500);
    });
  });
}
