/**
 * SmartPark Urban Dynamic Curb Space Congestion Pricing View
 * Displays time-varying street curb tariff schedules, freight unloads, and parking turnover incentives.
 */

window.UrbanCurbPricingView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="curb-pricing-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f59e0b;">🏷️ Urban Dynamic Curb Space Congestion Tariffs</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Time-varying municipal curb pricing matrix to prevent delivery double-parking</p>
          </div>
          <span style="background: #78350f; color: #fde68a; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Peak Commercial Tier Active
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Commercial Delivery (08-12)</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #f59e0b; margin-top: 2px;">₹40.00 / hr</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Max Dwell: 20 mins</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Retail Short Stay (12-17)</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #34d399; margin-top: 2px;">₹25.00 / hr</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Max Dwell: 45 mins</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Evening Dining (17-22)</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">₹35.00 / hr</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Max Dwell: 60 mins</div>
          </div>
        </div>
      </div>
    `;
  }
};
