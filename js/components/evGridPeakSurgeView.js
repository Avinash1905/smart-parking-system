/**
 * SmartPark EV Transformer Thermal Protection & Demand Surge View
 * Displays real-time transformer oil temperature curves and automatic charger throttling status.
 */

window.EVGridPeakSurgeView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="surge-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">⚡ EV Transformer Thermal & Surge Protection</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Transformer oil temperature rise prevention & dynamic kW throttling</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Transformer: 64.0°C (NOMINAL)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Substation Load</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">210.0 kW / 250 kW</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">84% Capacity</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Throttling Factor</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #34d399; margin-top: 2px;">1.00x (Full Speed)</div>
            <div style="font-size: 0.75rem; color: #a7f3d0;">No Curtailment Needed</div>
          </div>
        </div>
      </div>
    `;
  }
};
