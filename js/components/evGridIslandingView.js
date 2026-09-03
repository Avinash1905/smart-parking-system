/**
 * SmartPark Microgrid Islanding & Black-Start Emergency Dispatch View
 * Displays facility autonomous power state, life-safety battery reserves, and blackout protection.
 */

window.EVGridIslandingView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="islanding-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">🛡️ Microgrid Islanding & Emergency Black-Start</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Autonomous facility microgrid powering life-safety pumps and barriers during blackout</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 9.4 Hours Islanded Runtime Stored
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">BESS Energy Reserve</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #10b981; margin-top: 2px;">425.0 kWh</div>
            <div style="font-size: 0.75rem; color: #34d399;">85% State of Charge</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Life-Safety Power Draw</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">45.0 kW</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">Pumps, Fans, Barriers</div>
          </div>
        </div>
      </div>
    `;
  }
};
