/**
 * SmartPark Campus Electric Shuttle & Micro-Mobility Component
 * Real-time shuttle departure countdowns and e-scooter connections from parking decks to towers.
 */

import { showToast } from './toast.js';

export function openShuttleHubModal() {
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

  const shuttles = [
    { code: "SHUTTLE-E1", name: "Think Campus Express", next: "Arriving in 3 Mins", stop: "Deck Alpha West Gate", seats: "8 Seats Open" },
    { code: "SHUTTLE-E2", name: "Electronics City Phase 1 Loop", next: "Arriving in 6 Mins", stop: "Infosys Main Gate", seats: "14 Seats Open" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-shuttle-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🚐 Zero-Emission Transit
            </span>
            <h3 class="modal-title">Campus Shuttle & Micro-Mobility</h3>
          </div>
          <button type="button" class="modal-close" id="modal-shuttle-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
            Free automated electric shuttle connections between parking decks and corporate office towers.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${shuttles.map(s => `
              <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: var(--text-primary); font-size: 0.95rem;">${s.name}</strong>
                  <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">● ${s.next}</span>
                </div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary);">
                  Pickup: <strong>${s.stop}</strong> • ${s.seats}
                </div>
              </div>
            `).join('')}
          </div>

          <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted);">DECK DOCKING STATION:</span>
              <div style="font-size: 0.95rem; font-weight: 800; color: var(--accent-cyan);">🛴 14 Campus E-Scooters Available</div>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-unlock-scooter">
              Unlock E-Scooter
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-shuttle-close').addEventListener('click', closeModal);
  document.getElementById('modal-shuttle-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-shuttle-overlay') closeModal();
  });

  document.getElementById('btn-unlock-scooter').addEventListener('click', () => {
    showToast("E-Scooter unlocked at Deck Alpha Dock #4! Happy riding.", "success", 2500);
    closeModal();
  });
}
