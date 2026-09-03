/**
 * SmartPark Vehicle-to-Grid (V2G) Energy Trading View Component
 * Renders live microgrid peak shaving arbitrage curves, driver earnings (₹14.50/kWh), and facility demand offsets.
 */

import { showToast } from './toast.js';

export function renderV2GArbitrageView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        ⚡ Vehicle-to-Grid (V2G) Microgrid Arbitrage
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Monetize parked EV battery capacity by discharging during commercial peak grid tariff windows at ₹14.50/kWh.
      </p>
    </div>

    <!-- Arbitrage Metrics -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
      <div class="stat-card" style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">CURRENT FEED-IN TARIFF</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: var(--status-high-text); margin: 6px 0;">₹14.50 / kWh</div>
        <span style="font-size: 0.75rem; color: var(--status-high-text);">● Peak Rate Active (18:00 - 22:00)</span>
      </div>

      <div class="stat-card" style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">FACILITY PEAK SHAVING</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: var(--primary-600); margin: 6px 0;">185 kW Offset</div>
        <span style="font-size: 0.75rem; color: var(--primary-600);">12 Connected EVs Participating</span>
      </div>

      <div class="stat-card" style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">DRIVER EARNINGS PAID</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: var(--accent-cyan); margin: 6px 0;">₹3,420 Today</div>
        <span style="font-size: 0.75rem; color: var(--accent-cyan);">Instant Wallet Credit</span>
      </div>
    </div>

    <!-- Opt-In Toggle & Guardrails -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px;">
      <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0 0 16px 0;">EV Smart Battery Export Guardrails</h3>
      
      <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-subtle); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 16px;">
        <div>
          <div style="font-weight: 800; color: var(--text-primary);">Minimum Reserve Battery SoC Limit</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Your EV will never be discharged below this percentage under any circumstances.</div>
        </div>
        <div style="font-size: 1.2rem; font-weight: 900; color: var(--primary-600);">50% SoC</div>
      </div>

      <button type="button" class="btn btn-primary" id="btn-toggle-v2g" style="width: 100%; justify-content: center;">
        ⚡ Enable Automated V2G Energy Trading for My EV
      </button>
    </div>
  `;

  document.getElementById('btn-toggle-v2g').addEventListener('click', () => {
    showToast("V2G Energy Arbitrage enabled for Hyundai Ioniq 5 (KA-01-MJ-5890).", "success", 4000);
  });
}
