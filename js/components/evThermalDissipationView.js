/**
 * SmartPark EV Charging Liquid Chiller Loop & Thermal Dissipation View
 * Displays real-time cable surface temperatures, coolant flow rates, and glycol pump RPMs.
 */

window.EVThermalDissipationView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="chiller-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">❄️ EV High-Power DC Cable Liquid Glycol Chiller</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Active convective cooling for 500A continuous charging sessions</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Coolant Flow: 14.0 LPM (Active)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Cable Handle Temp</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #34d399; margin-top: 2px;">38.5 °C</div>
            <div style="font-size: 0.75rem; color: #a7f3d0;">Thermal Headroom: 26.5°C</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Pump Inverter Speed</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">2,730 RPM</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">Proportional Modulation</div>
          </div>
        </div>
      </div>
    `;
  }
};
