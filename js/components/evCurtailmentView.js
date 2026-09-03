/**
 * SmartPark EV Demand Response & Active Frequency Curtailment View
 * Displays real-time grid frequency dips, automated fast-charger throttling, and demand response revenue.
 */

window.EVCurtailmentView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="ev-curtailment-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">⚡ EV Demand Response & Grid Stabilization</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automated frequency response & utility capacity revenue earnings</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Grid Freq: 49.98 Hz (Stable)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Active EV Load</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">180.0 kW</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">6 Fast Chargers</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Demand Curtailment</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #34d399; margin-top: 2px;">0.0% (Unthrottled)</div>
            <div style="font-size: 0.75rem; color: #a7f3d0;">Full Power Dispatched</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Utility ADR Revenue (MTD)</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #f59e0b; margin-top: 2px;">₹24,800</div>
            <div style="font-size: 0.75rem; color: #fde68a;">Grid Balancing Incentive</div>
          </div>
        </div>
      </div>
    `;
  }
};
