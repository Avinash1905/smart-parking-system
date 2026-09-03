/**
 * SmartPark Gate Entry Vehicle Condition & Damage Scan Modal Component
 * Visualizes 360-degree optical condition inspection logs upon entry barrier clearance.
 */

export function openVehicleInspectionModal(plate = "KA-01-MJ-5890") {
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
    <div class="modal-overlay active" id="modal-inspect-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Entry Barrier AI Scan</span>
            <h3 class="modal-title">Vehicle Condition Inspection Log</h3>
          </div>
          <button type="button" class="modal-close" id="modal-inspect-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; background: var(--bg-surface-subtle); padding: 12px 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted);">VEHICLE REGISTRATION</span>
              <div style="font-family: monospace; font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">${plate}</div>
            </div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">
              ● SCAN VERIFIED
            </span>
          </div>

          <!-- Body Panel Inspection Status Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
              <span style="font-size: 0.78rem; color: var(--text-muted);">FRONT BUMPER & HOOD</span>
              <div style="font-size: 0.95rem; font-weight: 800; color: var(--status-high-text); margin-top: 2px;">✓ CLEAN / NO DAMAGE</div>
            </div>

            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
              <span style="font-size: 0.78rem; color: var(--text-muted);">REAR BUMPER & TRUNK</span>
              <div style="font-size: 0.95rem; font-weight: 800; color: var(--status-high-text); margin-top: 2px;">✓ CLEAN / NO DAMAGE</div>
            </div>

            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
              <span style="font-size: 0.78rem; color: var(--text-muted);">LEFT DRIVER DOOR</span>
              <div style="font-size: 0.95rem; font-weight: 800; color: var(--status-med-text); margin-top: 2px;">⚠️ MINOR SURFACE SCRATCH</div>
            </div>

            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
              <span style="font-size: 0.78rem; color: var(--text-muted);">RIGHT PASSENGER PANEL</span>
              <div style="font-size: 0.95rem; font-weight: 800; color: var(--status-high-text); margin-top: 2px;">✓ CLEAN / NO DAMAGE</div>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-inspect" style="width: 100%;">
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-inspect-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-inspect').addEventListener('click', closeModal);
  document.getElementById('modal-inspect-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-inspect-overlay') closeModal();
  });
}
