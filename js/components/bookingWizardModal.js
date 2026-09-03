/**
 * SmartPark Multi-Step Reservation Wizard Modal Component
 * Guides the user through stall selection, duration sliders, dynamic fee previews, and QR pass confirmation.
 */

import { BookingController } from '../controllers/bookingController.js';
import { showToast } from './toast.js';

export function openBookingWizardModal(zone, preselectedSlot = 'A-01') {
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

  const rate = parseFloat(zone.price_per_hour || 20.0);

  const modalHtml = `
    <div class="modal-overlay active" id="modal-wizard-overlay">
      <div class="modal-content" style="max-width: 560px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🎟️ Step-by-Step Booking
            </span>
            <h3 class="modal-title">Reserve Stall at ${zone.name}</h3>
          </div>
          <button type="button" class="modal-close" id="modal-wizard-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Step 1: Slot & Duration -->
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">SELECTED BAY</label>
            <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-weight: 800; color: var(--text-primary);">
              Bay ${preselectedSlot} (Standard Vehicle Bay)
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">PARKING DURATION (HOURS)</label>
            <input type="range" id="wizard-duration-slider" min="1" max="12" value="2" style="width: 100%; accent-color: var(--primary-600);">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">
              <span id="wizard-duration-label">2 Hours</span>
              <span style="color: var(--primary-600);" id="wizard-price-label">₹${(rate * 2).toFixed(2)}</span>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">VEHICLE LICENSE PLATE</label>
            <input type="text" id="wizard-vehicle-plate" value="KA-01-MJ-5890" style="width: 100%; padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); color: var(--text-primary); font-weight: 800; text-transform: uppercase;">
          </div>

          <button type="button" class="btn btn-primary" id="btn-wizard-confirm" style="width: 100%; justify-content: center;">
            💳 Confirm &amp; Generate Digital QR Pass
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  const slider = document.getElementById('wizard-duration-slider');
  const durLabel = document.getElementById('wizard-duration-label');
  const priceLabel = document.getElementById('wizard-price-label');

  slider.addEventListener('input', () => {
    const hours = parseInt(slider.value, 10);
    durLabel.textContent = `${hours} Hour${hours > 1 ? 's' : ''}`;
    priceLabel.textContent = `₹${(rate * hours).toFixed(2)}`;
  });

  document.getElementById('modal-wizard-close').addEventListener('click', closeModal);
  document.getElementById('modal-wizard-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-wizard-overlay') closeModal();
  });

  document.getElementById('btn-wizard-confirm').addEventListener('click', async () => {
    const hours = parseInt(slider.value, 10);
    const plate = document.getElementById('wizard-vehicle-plate').value;
    await BookingController.submitReservation(zone.id, preselectedSlot, hours, plate, 'Car');
    closeModal();
  });
}
