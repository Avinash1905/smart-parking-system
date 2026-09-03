/**
 * SmartPark Peer-to-Peer (P2P) Driveway Subletting Marketplace Component
 * Enables homeowners to rent out empty driveways and drivers to book low-cost neighborhood parking.
 */

import { showToast } from './toast.js';

export function openP2PSubletModal() {
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

  const listings = [
    { id: "p2p-1", title: "Gated Driveway near Indiranagar Metro", host: "Priya V.", addr: "12th Main, HAL 2nd Stage", rate: 25, ev: true },
    { id: "p2p-2", title: "Covered Bay near Sony Signal", host: "Siddharth R.", addr: "80 Feet Road, 4th Block Koramangala", rate: 30, ev: false }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-p2p-overlay">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🏡 P2P Community Marketplace
            </span>
            <h3 class="modal-title">Shared Driveway Rentals</h3>
          </div>
          <button type="button" class="modal-close" id="modal-p2p-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">
              Rent residential driveway spots from local verified hosts during weekday work hours.
            </p>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-list-my-driveway">
              + Host My Spot
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${listings.map(l => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                  <div>
                    <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-bottom: 2px;">${l.title}</h4>
                    <span style="font-size: 0.8125rem; color: var(--text-secondary);">${l.addr} • Host: ${l.host}</span>
                  </div>
                  <strong style="font-size: 1.15rem; color: var(--primary-600);">₹${l.rate}/hr</strong>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 10px;">
                  <span style="font-size: 0.78rem; color: ${l.ev ? 'var(--status-high-text)' : 'var(--text-muted)'};">
                    ${l.ev ? '⚡ EV Charging Wallbox Available' : 'Standard Parking Bay'}
                  </span>
                  <button type="button" class="btn btn-primary btn-sm btn-book-p2p" data-title="${l.title}">
                    Book Driveway →
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

  document.getElementById('modal-p2p-close').addEventListener('click', closeModal);
  document.getElementById('modal-p2p-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-p2p-overlay') closeModal();
  });

  document.getElementById('btn-list-my-driveway').addEventListener('click', () => {
    showToast("Opening Host Driveway Onboarding wizard...", "info", 2000);
  });

  modalContainer.querySelectorAll('.btn-book-p2p').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-title');
      showToast(`Driveway reservation confirmed at ${t}! Host notified.`, "success", 2500);
      closeModal();
    });
  });
}
