/**
 * SmartPark Stadium & Special Event Parking Pass Modal Component
 * Enables event attendees to pre-purchase guaranteed parking with express exit lanes.
 */

import { showToast } from './toast.js';

export function openEventParkingModal() {
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

  const events = [
    { name: "IPL T20 Cricket Match", venue: "M. Chinnaswamy Stadium (Cubbon Road)", date: "Tonight, 07:00 PM", price: 200, passes: "38 Passes Left" },
    { name: "International Music Fest", venue: "Bangalore Palace Grounds", date: "Saturday, 05:00 PM", price: 250, passes: "84 Passes Left" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-event-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(239,68,68,0.15); color: #ef4444; margin-bottom: 4px;">
              🎟️ Game-Day & Concerts
            </span>
            <h3 class="modal-title">Special Event Parking Passes</h3>
          </div>
          <button type="button" class="modal-close" id="modal-event-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Guaranteed parking spots during high-traffic sports matches and festivals. Includes priority express post-event exit lanes.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${events.map(e => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                  <div>
                    <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">${e.name}</h4>
                    <span style="font-size: 0.8125rem; color: var(--text-secondary);">${e.venue} • ${e.date}</span>
                  </div>
                  <strong style="font-size: 1.2rem; color: var(--primary-600);">₹${e.price}</strong>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 10px;">
                  <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">
                    ● ${e.passes}
                  </span>
                  <button type="button" class="btn btn-primary btn-sm btn-book-event-pass" data-name="${e.name}">
                    Book Event Pass →
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

  document.getElementById('modal-event-close').addEventListener('click', closeModal);
  document.getElementById('modal-event-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-event-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-book-event-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const n = btn.getAttribute('data-name');
      showToast(`Event pass booked for ${n}! Express QR permit generated.`, "success", 3000);
      closeModal();
    });
  });
}
