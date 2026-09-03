/**
 * SmartPark Regional Wholesale Electricity Spot Rate Forecast View
 * Displays 24-hour day-ahead electricity prices and automated EV low-cost charging schedule suggestions.
 */

window.EVGridPeakTariffView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="grid-tariff-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">⚡ 24-Hour Regional Grid Spot Electricity Tariffs</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Wholesale power market forecasting for automated low-cost EV charging</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Best Charge Window: 00:00 - 05:00 AM (₹3.80/kWh)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Current Grid Rate</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">₹7.50 / kWh</div>
            <div style="font-size: 0.75rem; color: #cbd5e1;">Standard Day Tier</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Upcoming Evening Peak (17-21)</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #ef4444; margin-top: 2px;">₹13.80 / kWh</div>
            <div style="font-size: 0.75rem; color: #fca5a5;">Discharge BESS Solar</div>
          </div>
        </div>
      </div>
    `;
  }
};
