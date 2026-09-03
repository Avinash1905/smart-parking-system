/**
 * SmartPark Dynamic Tidal Lane Direction & Pneumatic Bollard Console
 * Renders tidal lane allocations (e.g. 3 In / 1 Out morning rush) with bollard and signal indicators.
 */

window.DynamicLaneReversalView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="lane-reversal-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🔄 Dynamic Tidal Lane Reversal & Bollards</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automated lane direction changes to ease morning & evening commute bottlenecks</p>
          </div>
          <span style="background: #065f46; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Active: MORNING SURGE (3 IN / 1 OUT)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">LANE 01</div>
            <div style="font-size: 1.5rem; color: #10b981; margin: 4px 0;">⬇ IN</div>
            <div style="font-size: 0.75rem; color: #34d399;">Bollard: Lowered</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">LANE 02</div>
            <div style="font-size: 1.5rem; color: #10b981; margin: 4px 0;">⬇ IN</div>
            <div style="font-size: 0.75rem; color: #34d399;">Bollard: Lowered</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">LANE 03 (TIDAL)</div>
            <div style="font-size: 1.5rem; color: #38bdf8; margin: 4px 0;">⬇ IN (REVERSED)</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">Signal: Green Down</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">LANE 04</div>
            <div style="font-size: 1.5rem; color: #f59e0b; margin: 4px 0;">⬆ OUT</div>
            <div style="font-size: 0.75rem; color: #fbbf24;">Exit Channel</div>
          </div>
        </div>
      </div>
    `;
  }
};
