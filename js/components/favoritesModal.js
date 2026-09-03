/**
 * SmartPark Favorites & Quick Bookmarks Modal Component
 * Enables quick 1-click rebooking of frequently used parking facilities.
 */

import { showToast } from './toast.js';

let userFavorites = [
  { id: "fav-01", zoneId: "zone-pvt-01", zoneName: "TCS Corporate Parking Deck Alpha", nickname: "Workplace", rate: 10.0 },
  { id: "fav-02", zoneId: "zone-pub-01", zoneName: "Municipal Central Parking", nickname: "Weekend City Center", rate: 20.0 }
];

export function openFavoritesModal(onQuickBook) {
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
    <div class="modal-overlay active" id="modal-fav-overlay">
      <div class="modal-content" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Quick Access</span>
            <h3 class="modal-title">Saved Parking Locations</h3>
          </div>
          <button type="button" class="modal-close" id="modal-fav-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${userFavorites.map(f => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg);">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                    <span style="font-size: 1.1rem;">⭐</span>
                    <strong style="color: var(--text-primary); font-size: 0.95rem;">${f.nickname}</strong>
                  </div>
                  <span style="font-size: 0.8125rem; color: var(--text-secondary);">${f.zoneName} (₹${f.rate}/hr)</span>
                </div>

                <button type="button" class="btn btn-primary btn-sm btn-quick-book-fav" data-id="${f.zoneId}">
                  1-Click Book →
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-fav-close').addEventListener('click', closeModal);
  document.getElementById('modal-fav-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-fav-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-quick-book-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      const zId = btn.getAttribute('data-id');
      showToast("Launching instant 1-click reservation...", "success", 1500);
      if (onQuickBook) onQuickBook(zId);
      closeModal();
    });
  });
}
