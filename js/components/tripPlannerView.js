/**
 * SmartPark Multi-Stop Trip Planner Component
 * Enables drivers to plan sequential destinations and auto-reserve parking along their route.
 */

import { showToast } from './toast.js';

export function openTripPlannerModal() {
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
    <div class="modal-overlay active" id="modal-trip-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Route Planner</span>
            <h3 class="modal-title">Multi-Stop City Trip Itinerary</h3>
          </div>
          <button type="button" class="modal-close" id="modal-trip-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Reserve guaranteed bays across multiple destinations for meetings or shopping trips with synchronized start/end windows.
          </p>

          <!-- Sequential Stops Flow -->
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            <!-- Stop 1 -->
            <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="badge badge-public">Stop 1 • 10:30 AM</span>
                <strong style="color: var(--primary-600);">2.0 Hours</strong>
              </div>
              <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-bottom: 2px;">Municipal Central Parking</h4>
              <span style="font-size: 0.78rem; color: var(--text-muted);">Cubbon Park • Assigned Bay: M-24</span>
            </div>

            <!-- Stop 2 -->
            <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="badge badge-public">Stop 2 • 02:00 PM</span>
                <strong style="color: var(--primary-600);">1.5 Hours</strong>
              </div>
              <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-bottom: 2px;">Brigade Road Smart Multilevel Lot</h4>
              <span style="font-size: 0.78rem; color: var(--text-muted);">Ashok Nagar • Assigned Bay: B-12</span>
            </div>
          </div>

          <!-- Total Tariff Callout -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted);">TOTAL ITINERARY TARIFF:</span>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--status-high-text);">₹92.50 (Bundle Discount Applied)</div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" id="btn-confirm-trip-bundle" style="width: 100%; justify-content: center;">
            Book All 2 Stops in Itinerary →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-trip-close').addEventListener('click', closeModal);
  document.getElementById('modal-trip-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-trip-overlay') closeModal();
  });

  document.getElementById('btn-confirm-trip-bundle').addEventListener('click', () => {
    showToast("Multi-stop itinerary booked! Digital QR passes generated for both facilities.", "success", 3000);
    closeModal();
  });
}
