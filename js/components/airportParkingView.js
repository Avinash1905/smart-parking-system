/**
 * SmartPark Airport Long-Term Valet & Flight Tracker Component
 * Multi-day airport valet booking with synchronized return flight arrival telemetry.
 */

import { showToast } from './toast.js';

export function openAirportParkingModal() {
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
    <div class="modal-overlay active" id="modal-airport-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">✈️ Airport Long-Term</span>
            <h3 class="modal-title">Airport Terminal Valet & Flight Sync</h3>
          </div>
          <button type="button" class="modal-close" id="modal-airport-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.1) 100%); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 18px; margin-bottom: 20px;">
            <strong style="color: var(--text-primary); font-size: 1.05rem; display: block; margin-bottom: 2px;">
              Kempegowda International Airport (BLR)
            </strong>
            <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.4;">
              Drop off your car at Terminal 2 Curbside. We track your return flight and have your vehicle waiting at arrivals.
            </p>
          </div>

          <form id="form-airport-booking">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
              <div class="input-group">
                <label class="input-label" for="terminal-select">Terminal</label>
                <select id="terminal-select" class="input-control">
                  <option value="T2">Terminal 2 (Curbside Valet)</option>
                  <option value="T1">Terminal 1 (North Gate)</option>
                </select>
              </div>

              <div class="input-group">
                <label class="input-label" for="flight-num-input">Return Flight # *</label>
                <input type="text" id="flight-num-input" class="input-control" placeholder="e.g. 6E-5021" value="6E-5021" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px;">
              <div class="input-group">
                <label class="input-label" for="days-parked-input">Days Duration</label>
                <input type="number" id="days-parked-input" class="input-control" min="1" max="30" value="4" required />
              </div>

              <div class="input-group">
                <label class="input-label">Total Long-Term Rate</label>
                <div style="padding: 10px 14px; background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); font-weight: 800; color: var(--primary-600); font-size: 1.1rem;">
                  ₹1,800 (₹450/day)
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
              Book Airport Curbside Valet →
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-airport-close').addEventListener('click', closeModal);
  document.getElementById('modal-airport-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-airport-overlay') closeModal();
  });

  document.getElementById('form-airport-booking').addEventListener('submit', (e) => {
    e.preventDefault();
    const flight = document.getElementById('flight-num-input').value.trim();
    showToast(`Airport Valet booked! Live tracking active for Flight ${flight.toUpperCase()}.`, "success", 3000);
    closeModal();
  });
}
