/**
 * SmartPark Roadside VMS Display Sign Board Emulator Component
 * Renders street-level LED sign board showing live floor-by-floor vacant spots and directional arrows.
 */

export function openVMSDisplayModal(zoneName = "Municipal Central Parking") {
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
    <div class="modal-overlay active" id="modal-vms-overlay">
      <div class="modal-content" style="max-width: 540px; background: #0b0f19;">
        <div class="modal-header" style="border-bottom-color: rgba(255,255,255,0.1);">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: #10b981; margin-bottom: 4px;">
              Digital Roadside VMS Sign
            </span>
            <h3 class="modal-title" style="color: #ffffff;">LED Parking Guidance Sign</h3>
          </div>
          <button type="button" class="modal-close" id="modal-vms-close" style="color: #9ca3af;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Outdoor Roadside LED Sign Board Frame -->
          <div style="background: #030712; border: 3px solid #374151; border-radius: var(--radius-xl); padding: 20px; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); margin-bottom: 20px;">
            <div style="text-align: center; border-bottom: 1.5px solid #1f2937; padding-bottom: 12px; margin-bottom: 16px;">
              <span style="font-family: 'Courier New', monospace; font-size: 0.9rem; font-weight: 800; color: #f59e0b; letter-spacing: 0.12em;">
                🅿️ SMARTPARK CIVIC GUIDANCE
              </span>
              <h4 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin-top: 4px;">${zoneName}</h4>
            </div>

            <!-- Floor Levels Matrix -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; background: #111827; padding: 12px 18px; border-radius: 8px; border: 1px solid #1f2937;">
                <span style="font-family: 'Courier New', monospace; font-weight: 800; font-size: 1.1rem; color: #ffffff;">LEVEL G (GROUND)</span>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <strong style="font-family: 'Courier New', monospace; font-size: 1.3rem; color: #10b981;">18 OPEN</strong>
                  <span style="font-size: 1.2rem;">➡️</span>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; background: #111827; padding: 12px 18px; border-radius: 8px; border: 1px solid #1f2937;">
                <span style="font-family: 'Courier New', monospace; font-weight: 800; font-size: 1.1rem; color: #ffffff;">LEVEL B1 (BASEMENT 1)</span>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <strong style="font-family: 'Courier New', monospace; font-size: 1.3rem; color: #10b981;">14 OPEN</strong>
                  <span style="font-size: 1.2rem;">⬇️</span>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; background: #111827; padding: 12px 18px; border-radius: 8px; border: 1px solid #1f2937;">
                <span style="font-family: 'Courier New', monospace; font-weight: 800; font-size: 1.1rem; color: #ffffff;">LEVEL B2 (BASEMENT 2)</span>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <strong style="font-family: 'Courier New', monospace; font-size: 1.3rem; color: #10b981;">22 OPEN</strong>
                  <span style="font-size: 1.2rem;">⬇️</span>
                </div>
              </div>
            </div>

            <!-- LED Footer Banner -->
            <div style="text-align: center; margin-top: 16px; padding-top: 10px; border-top: 1px solid #1f2937;">
              <span style="font-family: 'Courier New', monospace; font-size: 0.8125rem; font-weight: 800; color: #06b6d4; letter-spacing: 0.08em;">
                ⚡ 8 EV FAST CHARGERS ACTIVE ON FLOOR G
              </span>
            </div>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-vms" style="width: 100%; border-color: #374151; color: #d1d5db;">
            Close Roadside Sign Preview
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-vms-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-vms').addEventListener('click', closeModal);
  document.getElementById('modal-vms-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-vms-overlay') closeModal();
  });
}
