/**
 * SmartPark Multimodal Public Transit Feeder Hub Component
 * Shows integrated Metro departures, electric shuttle feeder routes, and e-scooter docks.
 */

window.TransitHubView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="transit-hub-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #a78bfa;">🚇 Multimodal Transit Hub & Feeder Links</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Park & Ride seamless connections with Metro rail and feeder e-buses</p>
          </div>
          <span style="background: #2e1065; color: #c084fc; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Live Transit Sync
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
          <!-- Metro Schedule -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 0.85rem; font-weight: bold; color: #c084fc;">🟣 Cubbon Park Metro</span>
              <span style="font-size: 0.75rem; color: #94a3b8;">3 min walk</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="background: #1e293b; padding: 6px 10px; border-radius: 4px; display: flex; justify-content: space-between; font-size: 0.8rem;">
                <span>To Whitefield (Kadugodi)</span>
                <span style="color: #34d399; font-weight: bold;">in 2 mins</span>
              </div>
              <div style="background: #1e293b; padding: 6px 10px; border-radius: 4px; display: flex; justify-content: space-between; font-size: 0.8rem;">
                <span>To Challaghatta</span>
                <span style="color: #38bdf8; font-weight: bold;">in 7 mins</span>
              </div>
            </div>
          </div>

          <!-- Feeder Bus -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 0.85rem; font-weight: bold; color: #38bdf8;">🚌 Electric Feeder Bus</span>
              <span style="font-size: 0.75rem; color: #94a3b8;">Gate 2 Bay</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="background: #1e293b; padding: 6px 10px; border-radius: 4px; display: flex; justify-content: space-between; font-size: 0.8rem;">
                <span>MF-12: Electronic City</span>
                <span style="color: #34d399; font-weight: bold;">in 4 mins</span>
              </div>
              <div style="background: #1e293b; padding: 6px 10px; border-radius: 4px; display: flex; justify-content: space-between; font-size: 0.8rem;">
                <span>KIA-8: BLR Airport</span>
                <span style="color: #fbbf24; font-weight: bold;">in 14 mins</span>
              </div>
            </div>
          </div>

          <!-- Micro-Mobility Dock -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 0.85rem; font-weight: bold; color: #34d399;">🛴 E-Scooter Dock</span>
              <span style="font-size: 0.75rem; color: #94a3b8;">Plaza Wing</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
              <div>
                <div style="font-size: 1.2rem; font-weight: bold; color: #34d399;">12</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Scooters Available</div>
              </div>
              <div>
                <div style="font-size: 1.2rem; font-weight: bold; color: #38bdf8;">6</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">E-Bikes Ready</div>
              </div>
              <div>
                <div style="font-size: 1.2rem; font-weight: bold; color: #cbd5e1;">₹1.5/m</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Ride Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
