/**
 * SmartPark Security Stolen Vehicle Hotlist & Police Alert View
 * Displays real-time hotlisted license plates, lockdown triggers, and police alert statuses.
 */

window.SecurityHotlistView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="hotlist-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #ef4444;">🚨 National Police Crime Hotlist Sync (CCTNS)</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automated perimeter gate lockdowns & silent police dispatch alarms</p>
          </div>
          <button id="btn-add-hotlist-plate" style="background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Flag Stolen Vehicle
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; border-left: 4px solid #ef4444;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: bold; font-mono; font-size: 1rem; color: #f87171;">DL-01-XX-9999</span>
              <span style="background: #7f1d1d; color: #fca5a5; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">CRITICAL RED</span>
            </div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 6px;">Offense: Armed Vehicle Robbery (FIR-2026-90412)</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Jurisdiction: Delhi State Police • Action: Auto-Lockdown Active</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; border-left: 4px solid #f59e0b;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: bold; font-mono; font-size: 1rem; color: #fbbf24;">KA-04-ZZ-0000</span>
              <span style="background: #78350f; color: #fde68a; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">AMBER FLAG</span>
            </div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 6px;">Offense: Habitual Citation Evasion (>5 Unpaid Fines)</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Jurisdiction: Bengaluru Traffic Police • Action: Attendant Flag</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-add-hotlist-plate')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Police Hotlist Entry dialog opened.', 'info');
    });
  }
};
