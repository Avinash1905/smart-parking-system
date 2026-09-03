/**
 * SmartPark Vehicle-to-Grid (V2G) Power Export & Driver Payout View
 * Displays active bi-directional EV discharge sessions, building peak shaving, and driver payout earnings.
 */

window.V2GSmartDispatchView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="v2g-dispatch-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">⚡ Vehicle-to-Grid (V2G) Bi-Directional Power Export</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Earn revenue by feeding excess EV battery energy back during peak tariff spikes</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 22.0 kW Active Export
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Feed-in Tariff Rate</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #10b981; margin-top: 2px;">₹14.50 / kWh</div>
            <div style="font-size: 0.75rem; color: #34d399;">Peak Hour Rate</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Driver Earnings Today</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #f59e0b; margin-top: 2px;">₹243.60</div>
            <div style="font-size: 0.75rem; color: #fde68a;">21 kWh Discharged</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Departure Reserve</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">64% Battery</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">Guaranteed Range: 220 km</div>
          </div>
        </div>
      </div>
    `;
  }
};
