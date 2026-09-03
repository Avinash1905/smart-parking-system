/**
 * SmartPark Variable Message Signage (VMS) Live LED Matrix Display View
 * Renders full-matrix RGB LED highway guidance boards with dynamic occupancy counts and alerts.
 */

window.VMSSignageControllerView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="vms-signage-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f59e0b;">🚥 Variable Message Signage (VMS) Roadway Matrix</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Real-time LED guidance signs broadcasting to highway approaches</p>
          </div>
          <span style="background: #78350f; color: #fde68a; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 3 Highway Boards Online
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <!-- Sign 1: North Outer Ring Road -->
          <div style="background: #000000; border: 2px solid #334155; border-radius: 8px; padding: 14px; box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-bottom: 6px;">
              <span>VMS-ROAD-NORTH (128x64 RGB)</span>
              <span style="color: #10b981;">● SYNCED</span>
            </div>
            <div style="font-family: 'Courier New', monospace; font-weight: 900; font-size: 1.1rem; color: #f59e0b; text-align: center; letter-spacing: 2px; line-height: 1.4;">
              MUNICIPAL CENTRAL<br>
              <span style="color: #10b981;">SPACES OPEN: 42 ▲</span>
            </div>
          </div>

          <!-- Sign 2: South Metro Approach -->
          <div style="background: #000000; border: 2px solid #334155; border-radius: 8px; padding: 14px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-bottom: 6px;">
              <span>VMS-ROAD-SOUTH (128x64 RGB)</span>
              <span style="color: #10b981;">● SYNCED</span>
            </div>
            <div style="font-family: 'Courier New', monospace; font-weight: 900; font-size: 1.1rem; color: #38bdf8; text-align: center; letter-spacing: 2px; line-height: 1.4;">
              METRO EAST HUB<br>
              <span style="color: #10b981;">SPACES OPEN: 18 ▲</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
