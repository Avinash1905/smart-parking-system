/**
 * SmartPark Electronic Wheel Clamp Immobilizer Operations View
 * Displays active vehicle immobilizations, tamper alarm states, and fine settlement PIN entries.
 */

window.SmartWheelClampView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="wheel-clamp-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #fbbf24;">🔒 Electronic Smart Wheel Clamp Console</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Immobilizer hardware management & automated settlement unlatching</p>
          </div>
          <button id="btn-deploy-new-clamp" style="background: #eab308; color: #000; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Deploy Wheel Clamp
          </button>
        </div>

        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-weight: 600; font-mono; font-size: 0.95rem; color: #f87171;">DL-09-CQ-4100 (BOOT-401)</span>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Hardware ID: CLAMP-BT-8891 • Bay EV-02</div>
            </div>
            <span style="background: #7f1d1d; color: #fca5a5; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
              LOCKED (ARMED)
            </span>
          </div>

          <div style="margin-top: 10px; font-size: 0.8rem; color: #cbd5e1;">
            Infraction: Unauthorized ICE Vehicle Blocking EV Station (+90m Overstay). Fine: ₹1,500.
          </div>

          <div style="display: flex; gap: 8px; margin-top: 12px; align-items: center;">
            <input type="text" id="clamp-unlock-pin" placeholder="Enter Settlement PIN (e.g. REL-992144)" 
                   style="flex: 1; padding: 6px 10px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: #fff; font-family: monospace; font-size: 0.85rem;">
            <button id="btn-submit-clamp-unlock" style="background: #10b981; color: #fff; border: none; border-radius: 4px; padding: 6px 14px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">
              Unlock Solenoid
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-submit-clamp-unlock')?.addEventListener('click', () => {
      const pin = document.getElementById('clamp-unlock-pin')?.value;
      if (pin && pin.startsWith('REL-')) {
        if (window.Toast) window.Toast.show('Solenoid released! Wheel clamp disengaged.', 'success');
      } else {
        if (window.Toast) window.Toast.show('Invalid release PIN. Settle fine first.', 'error');
      }
    });
  }
};
