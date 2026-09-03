/**
 * SmartPark Overhead RGB LED Guidance Strip Matrix Component
 * Displays live addressable LED indicator strips mounted above parking bays for driver sightline guidance.
 */

import { showToast } from './toast.js';

export function openLEDMatrixModal(zoneName = "Municipal Central Parking") {
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

  const leds = [
    { bay: "A-01", color: "#10b981", state: "🟢 GREEN (VACANT)", meaning: "Available for any vehicle" },
    { bay: "A-02", color: "#ef4444", state: "🔴 RED (OCCUPIED)", meaning: "Vehicle parked" },
    { bay: "A-03", color: "#06b6d4", state: "🔵 CYAN (EV FAST CHARGE)", meaning: "Dedicated EV stall open" },
    { bay: "A-04", color: "#10b981", state: "🟢 GREEN (VACANT)", meaning: "Available for any vehicle" },
    { bay: "A-05", color: "#f59e0b", state: "🟡 AMBER (RESERVED)", meaning: "Booked - Driver approaching" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-led-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Optical Guidance</span>
            <h3 class="modal-title">Overhead RGB LED Strip Matrix</h3>
          </div>
          <button type="button" class="modal-close" id="modal-led-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Addressable high-lumen RGB LED light strips positioned directly over bay centerlines for 100-meter line-of-sight visibility.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${leds.map(l => `
              <div style="background: var(--bg-surface-subtle); border-left: 6px solid ${l.color}; border-radius: var(--radius-lg); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">Bay ${l.bay}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">${l.meaning}</div>
                </div>
                <span style="font-size: 0.84rem; font-weight: 800; color: ${l.color};">${l.state}</span>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-led-matrix" style="width: 100%;">
            Close LED Matrix
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-led-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-led-matrix').addEventListener('click', closeModal);
  document.getElementById('modal-led-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-led-overlay') closeModal();
  });
}
