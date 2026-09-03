/**
 * SmartPark Metro Park-and-Ride Transit Feeder Component
 * Synchronizes metro train departure boards with adjacent parking facilities for frictionless multi-modal commutes.
 */

import { showToast } from './toast.js';

export function openTransitFeederModal() {
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

  const lines = [
    { name: "Purple Line", station: "Cubbon Park Metro Station", time: "Next in 3 Mins", freq: "Every 5 mins", deck: "Municipal Central Parking", color: "#9333ea" },
    { name: "Green Line", station: "MG Road Interchange", time: "Next in 5 Mins", freq: "Every 6 mins", deck: "City Center Metro Plaza", color: "#16a34a" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-transit-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🚇 Multi-Modal Commute
            </span>
            <h3 class="modal-title">Metro Park & Ride Feeder Sync</h3>
          </div>
          <button type="button" class="modal-close" id="modal-transit-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Park your vehicle at connected municipal decks and transfer directly to metro trains with an integrated 25% transit discount.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${lines.map(l => `
              <div style="background: var(--bg-surface-subtle); border-left: 5px solid ${l.color}; border-radius: var(--radius-lg); padding: 14px 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <strong style="color: ${l.color}; font-size: 0.95rem;">${l.name} • ${l.station}</strong>
                  <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">${l.time}</span>
                </div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary);">
                  Connected Parking: <strong>${l.deck}</strong> (Frequency: ${l.freq})
                </div>
              </div>
            `).join('')}
          </div>

          <!-- NCMC Smart Card Discount Banner -->
          <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted);">COMBINED TRANSIT DISCOUNT:</span>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary-600);">25% Off Park & Ride Fare</div>
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-claim-transit-pass">
              Link Metro Smart Card
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-transit-close').addEventListener('click', closeModal);
  document.getElementById('modal-transit-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-transit-overlay') closeModal();
  });

  document.getElementById('btn-claim-transit-pass').addEventListener('click', () => {
    showToast("Namma Metro Smart Card / RuPay NCMC linked! 25% discount active.", "success", 2500);
    closeModal();
  });
}
