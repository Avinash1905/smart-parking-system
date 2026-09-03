/**
 * SmartPark Special Event & Stadium Parking Management View Component
 * Visualizes dynamic surge pricing multipliers, temporary event shuttle frequencies, and road closures.
 */

import { showToast } from './toast.js';

export function renderEventSurgeView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        🎪 Special Event &amp; Traffic Surge Management
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Real-time event zone configuration for stadiums, tech summits, and municipal concert venues.
      </p>
    </div>

    <!-- Active Event Banner -->
    <div style="background: var(--bg-surface); border: 2px solid var(--primary-600); border-radius: var(--radius-xl); padding: 24px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span class="badge badge-public" style="background: rgba(99,102,241,0.2); color: var(--primary-600);">
          ● ACTIVE SPECIAL EVENT
        </span>
        <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">18,500 EXPECTED VEHICLES</span>
      </div>

      <h3 style="font-size: 1.4rem; font-weight: 900; margin: 0 0 8px 0; color: var(--text-primary);">
        Bengaluru Tech Summit 2026 (Palace Grounds Corridor)
      </h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 16px 0;">
        Automated 1.25x event surge multiplier applied across 4 surrounding municipal decks. Express shuttle frequency increased to every 5 minutes.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
        <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">SURGE TARIFF</div>
          <div style="font-size: 1.2rem; font-weight: 900; color: var(--status-high-text); margin-top: 2px;">1.25x Active</div>
        </div>
        <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">SHUTTLE CADENCE</div>
          <div style="font-size: 1.2rem; font-weight: 900; color: var(--primary-600); margin-top: 2px;">5 Min Intervals</div>
        </div>
        <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">LANE REVERSAL</div>
          <div style="font-size: 1.2rem; font-weight: 900; color: var(--accent-cyan); margin-top: 2px;">Armed (Northbound)</div>
        </div>
      </div>
    </div>
  `;
}
