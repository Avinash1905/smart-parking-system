/**
 * SmartPark Turn-by-Turn Spatial Navigator Component
 * Displays live directions from current location to reserved parking bay.
 */

export function openLiveNavigationModal(zoneName = "Municipal Central Parking", slotNumber = "A-24") {
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

  const steps = [
    { num: 1, text: "Head south toward Kasturba Main Road", dist: "350 m", icon: "⬆️" },
    { num: 2, text: "Turn right onto Metro North Cross", dist: "750 m", icon: "➡️" },
    { num: 3, text: `Enter ${zoneName} via Gate #1`, dist: "120 m", icon: "⬅️" },
    { num: 4, text: "Scan QR token at entrance boom barrier", dist: "20 m", icon: "🛡️" },
    { num: 5, text: `Park at reserved Bay ${slotNumber} (Floor G)`, dist: "Arrive", icon: "🅿️" }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-nav-overlay">
      <div class="modal-content" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">GPS Turn Navigator</span>
            <h3 class="modal-title">Live Route to Bay ${slotNumber}</h3>
          </div>
          <button type="button" class="modal-close" id="modal-nav-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Top ETA Banner -->
          <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted);">ESTIMATED ARRIVAL TIME</span>
              <div style="font-size: 1.3rem; font-weight: 800; color: var(--primary-600);">5 Mins (1.2 km)</div>
            </div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">
              Clear Traffic
            </span>
          </div>

          <!-- Step by Step Directions -->
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${steps.map(s => `
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <div style="font-size: 1.25rem;">${s.icon}</div>
                <div style="flex: 1;">
                  <strong style="font-size: 0.875rem; color: var(--text-primary); display: block;">${s.text}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${s.dist}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-nav" style="width: 100%;">
            Exit Navigator
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-nav-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-nav').addEventListener('click', closeModal);
  document.getElementById('modal-nav-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-nav-overlay') closeModal();
  });
}
