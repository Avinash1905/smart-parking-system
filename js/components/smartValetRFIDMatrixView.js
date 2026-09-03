/**
 * SmartPark Smart Valet 13.56MHz RFID Key Fob Locker View
 * Displays electronic key safe solenoid dispensing upon runner RFID card tap.
 */

window.SmartValetRFIDMatrixView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="rfid-matrix-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #fbbf24;">🏷️ 13.56MHz RFID Key Fob Matrix & Solenoid Dispenser</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automated contactless locker door popping on valet runner badge tap</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Solenoids Online (Pulse: 500ms)
          </span>
        </div>

        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #cbd5e1;">
            <span>Last Dispense: Locker Box #04 (Ticket #VAL-9901)</span>
            <span style="color: #34d399; font-weight: bold;">DOOR POPPED</span>
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">Authenticated Runner Badge: RFID-RUNNER-01 (Deepak V.)</div>
        </div>
      </div>
    `;
  }
};
