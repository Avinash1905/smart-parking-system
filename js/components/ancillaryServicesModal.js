/**
 * SmartPark Ancillary Vehicle Care Services Modal Component
 * Enables drivers to add car wash, vacuuming, and tire maintenance while parked.
 */

import { showToast } from './toast.js';

export function openAncillaryServicesModal() {
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

  const services = [
    { id: "srv-wash", name: "Eco Waterless Hand Car Wash", price: 199, icon: "✨", desc: "100% scratch-free biodegradable exterior polish while you work." },
    { id: "srv-vacuum", name: "Interior Deep Vacuum & Sanitization", price: 149, icon: "🧹", desc: "Cabin sanitization, mat cleaning, and dashboard conditioning." },
    { id: "srv-tire", name: "4-Wheel Nitrogen Pressure Top-Up", price: 49, icon: "💨", desc: "Precision tire pressure calibration with pure dry nitrogen." }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-anc-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">On-Site Vehicle Care</span>
            <h3 class="modal-title">Add Parking Care Amenities</h3>
          </div>
          <button type="button" class="modal-close" id="modal-anc-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Get your vehicle cleaned and serviced in your reserved bay while parked.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${services.map(s => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg);">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  <div style="font-size: 1.4rem;">${s.icon}</div>
                  <div>
                    <strong style="color: var(--text-primary); font-size: 0.95rem; display: block;">${s.name}</strong>
                    <span style="font-size: 0.78rem; color: var(--text-secondary);">${s.desc}</span>
                  </div>
                </div>

                <div style="text-align: right; min-width: 100px;">
                  <strong style="font-size: 1.1rem; color: var(--primary-600); display: block;">₹${s.price}</strong>
                  <button type="button" class="btn btn-secondary btn-sm btn-book-addon" data-name="${s.name}" style="margin-top: 4px;">
                    + Add to Stay
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

  document.getElementById('modal-anc-close').addEventListener('click', closeModal);
  document.getElementById('modal-anc-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-anc-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-book-addon').forEach(btn => {
    btn.addEventListener('click', () => {
      const sName = btn.getAttribute('data-name');
      showToast(`${sName} added to your active parking session!`, "success", 2500);
      closeModal();
    });
  });
}
