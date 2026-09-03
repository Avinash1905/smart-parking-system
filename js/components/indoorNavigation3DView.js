/**
 * SmartPark Turn-by-Turn Indoor Deck Navigation View Component
 * Renders multi-floor wayfinding splines, compass bearings, clearance warnings, and stall arrival indicators.
 */

import { showToast } from './toast.js';

export function renderIndoorNavigation3DView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        🧭 Turn-by-Turn Indoor Wayfinding
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Live in-facility navigation guiding your vehicle from entry barrier to allocated stall Bay Floor 1 / A-04.
      </p>
    </div>

    <!-- Navigation HUD -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px; margin-bottom: 24px;">
      <div style="background: var(--bg-surface-subtle); padding: 20px; border-radius: var(--radius-lg); border: 2px solid var(--primary-600); text-align: center; margin-bottom: 20px;">
        <div style="font-size: 2.2rem; margin-bottom: 6px;">⬆️🚗📍</div>
        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">CURRENT WAYFINDING STEP</span>
        <div style="font-size: 1.6rem; font-weight: 900; color: var(--text-primary); margin: 4px 0;">Ascend Level 1 Spiral Ramp</div>
        <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">
          ● In 35 meters • Target: Floor 1 / Bay A-04
        </span>
      </div>

      <!-- Route Milestones -->
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="background: var(--bg-surface-subtle); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; color: var(--text-muted); text-decoration: line-through;">1. Entry Barrier Gate #01</span>
          <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); font-size: 0.7rem;">PASSED</span>
        </div>
        <div style="background: var(--bg-surface-subtle); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--primary-600); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 800; color: var(--primary-600);">2. Level 1 Express Spiral Ramp</span>
          <span class="badge badge-public" style="background: rgba(99,102,241,0.2); color: var(--primary-600); font-size: 0.7rem;">ACTIVE</span>
        </div>
        <div style="background: var(--bg-surface-subtle); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; color: var(--text-primary);">3. Turn Left into North Row A</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">In 85m</span>
        </div>
        <div style="background: var(--bg-surface-subtle); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; color: var(--text-primary);">4. Arrive at Assigned Bay A-04</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Destination</span>
        </div>
      </div>
    </div>
  `;
}
