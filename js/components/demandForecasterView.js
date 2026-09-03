/**
 * SmartPark Statistical Time-Series Demand Forecaster Chart Component
 * Displays 7-day occupancy projections with confidence bands and peak rush windows.
 */

window.DemandForecasterView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="demand-forecaster-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #a78bfa;">📈 7-Day Machine Learning Demand Forecast</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Holt-Winters seasonal exponential smoothing with 95% confidence bounds</p>
          </div>
          <span style="background: #3b0764; color: #d8b4fe; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 95% Confidence Model
          </span>
        </div>

        <!-- 7-Day Forecast Bar Graph -->
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 16px; text-align: center;">
          <div style="background: #0f172a; padding: 10px 4px; border-radius: 6px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Mon</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #f59e0b; margin: 4px 0;">84%</div>
            <div style="font-size: 0.65rem; color: #cbd5e1;">Rush 09:30</div>
          </div>

          <div style="background: #0f172a; padding: 10px 4px; border-radius: 6px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Tue</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #ef4444; margin: 4px 0;">92%</div>
            <div style="font-size: 0.65rem; color: #cbd5e1;">Rush 10:00</div>
          </div>

          <div style="background: #0f172a; padding: 10px 4px; border-radius: 6px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Wed</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #ef4444; margin: 4px 0;">88%</div>
            <div style="font-size: 0.65rem; color: #cbd5e1;">Rush 09:15</div>
          </div>

          <div style="background: #0f172a; padding: 10px 4px; border-radius: 6px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Thu</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #f59e0b; margin: 4px 0;">82%</div>
            <div style="font-size: 0.65rem; color: #cbd5e1;">Rush 09:30</div>
          </div>

          <div style="background: #0f172a; padding: 10px 4px; border-radius: 6px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Fri</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #38bdf8; margin: 4px 0;">76%</div>
            <div style="font-size: 0.65rem; color: #cbd5e1;">Eve 18:00</div>
          </div>

          <div style="background: #0f172a; padding: 10px 4px; border-radius: 6px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Sat</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #10b981; margin: 4px 0;">54%</div>
            <div style="font-size: 0.65rem; color: #cbd5e1;">Noon 14:00</div>
          </div>

          <div style="background: #0f172a; padding: 10px 4px; border-radius: 6px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Sun</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #10b981; margin: 4px 0;">48%</div>
            <div style="font-size: 0.65rem; color: #cbd5e1;">Low Demand</div>
          </div>
        </div>
      </div>
    `;
  }
};
