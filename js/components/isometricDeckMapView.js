/**
 * SmartPark 2.5D Vector Isometric Deck Map Component
 * Renders an interactive vector floor plan showing parked vehicles, EV chargers, elevator shafts, and drive aisles.
 */

import { showToast } from './toast.js';

export function openIsometricDeckModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-iso-overlay">
      <div class="modal-content" style="max-width: 680px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">2.5D Digital Twin</span>
            <h3 class="modal-title">Isometric Floor Layout (${zoneName})</h3>
          </div>
          <button type="button" class="modal-close" id="modal-iso-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Interactive Vector Canvas Frame -->
          <div style="background: #0f172a; border: 2px solid #1e293b; border-radius: var(--radius-xl); padding: 24px; text-align: center; margin-bottom: 16px; position: relative;">
            <div style="font-size: 0.8125rem; font-weight: 700; color: #94a3b8; margin-bottom: 12px; display: flex; justify-content: space-between;">
              <span>LEVEL GROUND (G) • 30 TOTAL BAYS</span>
              <span style="color: #10b981;">● 18 BAYS OPEN</span>
            </div>

            <!-- Vector Layout Schematic -->
            <svg viewBox="0 0 500 200" style="width: 100%; height: auto;">
              <!-- Drive Aisle -->
              <rect x="20" y="80" width="460" height="40" fill="#1e293b" rx="6" />
              <text x="250" y="105" fill="#64748b" font-size="12" font-weight="700" text-anchor="middle">CENTRAL TWO-WAY DRIVE AISLE ⬅️ ➡️</text>

              <!-- Top Row Bays -->
              <rect x="30" y="20" width="45" height="50" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.5" rx="4" />
              <text x="52" y="50" fill="#10b981" font-size="11" font-weight="800" text-anchor="middle">A-01</text>

              <rect x="85" y="20" width="45" height="50" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1.5" rx="4" />
              <text x="107" y="50" fill="#ef4444" font-size="11" font-weight="800" text-anchor="middle">A-02</text>

              <rect x="140" y="20" width="45" height="50" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" stroke-width="1.5" rx="4" />
              <text x="162" y="50" fill="#06b6d4" font-size="11" font-weight="800" text-anchor="middle">⚡ A-03</text>

              <rect x="195" y="20" width="45" height="50" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.5" rx="4" />
              <text x="217" y="50" fill="#10b981" font-size="11" font-weight="800" text-anchor="middle">A-04</text>

              <rect x="250" y="20" width="45" height="50" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5" rx="4" />
              <text x="272" y="50" fill="#f59e0b" font-size="11" font-weight="800" text-anchor="middle">A-05</text>

              <!-- Bottom Row Bays -->
              <rect x="30" y="130" width="45" height="50" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.5" rx="4" />
              <text x="52" y="160" fill="#10b981" font-size="11" font-weight="800" text-anchor="middle">A-06</text>

              <rect x="85" y="130" width="45" height="50" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.5" rx="4" />
              <text x="107" y="160" fill="#10b981" font-size="11" font-weight="800" text-anchor="middle">A-07</text>

              <rect x="140" y="130" width="45" height="50" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1.5" rx="4" />
              <text x="162" y="160" fill="#ef4444" font-size="11" font-weight="800" text-anchor="middle">A-08</text>

              <!-- Elevator Core -->
              <rect x="420" y="20" width="60" height="160" fill="#334155" stroke="#475569" stroke-width="1.5" rx="6" />
              <text x="450" y="105" fill="#cbd5e1" font-size="10" font-weight="800" text-anchor="middle" transform="rotate(-90 450,105)">ELEVATOR CORE</text>
            </svg>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-iso" style="width: 100%;">
            Close 2.5D Deck Viewer
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-iso-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-iso').addEventListener('click', closeModal);
  document.getElementById('modal-iso-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-iso-overlay') closeModal();
  });
}
